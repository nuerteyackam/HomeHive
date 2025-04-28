const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// @route   GET api/properties
// @desc    Get all properties
// @access  Public
router.get('/', async (req, res) => {
    try {
      // Extract query parameters for filtering
      const { city, state, minPrice, maxPrice, beds, baths, type, status } = req.query;
      
      let query = `
        SELECT p.*, u.name as agent_name, 
        (SELECT image_url FROM property_images WHERE property_id = p.id AND is_primary = true LIMIT 1) as primary_image
        FROM properties p
        JOIN users u ON p.user_id = u.id
        WHERE 1=1
      `;
      
      const queryParams = [];
      let paramCount = 1;
      
      // Add filters if provided
      if (city) {
        query += ` AND p.city ILIKE $${paramCount}`;
        queryParams.push(`%${city}%`);
        paramCount++;
      }
      
      if (state) {
        query += ` AND p.state ILIKE $${paramCount}`;
        queryParams.push(`%${state}%`);
        paramCount++;
      }
      
      if (minPrice) {
        query += ` AND p.price >= $${paramCount}`;
        queryParams.push(minPrice);
        paramCount++;
      }
      
      if (maxPrice) {
        query += ` AND p.price <= $${paramCount}`;
        queryParams.push(maxPrice);
        paramCount++;
      }
      
      if (beds) {
        query += ` AND p.bedrooms >= $${paramCount}`;
        queryParams.push(beds);
        paramCount++;
      }
      
      if (baths) {
        query += ` AND p.bathrooms >= $${paramCount}`;
        queryParams.push(baths);
        paramCount++;
      }
      
      if (type) {
        query += ` AND p.property_type = $${paramCount}`;
        queryParams.push(type);
        paramCount++;
      }
      
      if (status) {
        query += ` AND p.status = $${paramCount}`;
        queryParams.push(status);
        paramCount++;
      }
      
      query += ` ORDER BY p.created_at DESC`;
      
      const properties = await pool.query(query, queryParams);
      
      res.json(properties.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

// @route   GET api/properties/:id
// @desc    Get property by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
      // Get property details
      const property = await pool.query(
        `SELECT p.*, u.name as agent_name, u.email as agent_email 
         FROM properties p
         JOIN users u ON p.user_id = u.id
         WHERE p.id = $1`,
        [req.params.id]
      );
  
      if (property.rows.length === 0) {
        return res.status(404).json({ msg: 'Property not found' });
      }
  
      // Get property images
      const images = await pool.query(
        'SELECT * FROM property_images WHERE property_id = $1 ORDER BY is_primary DESC',
        [req.params.id]
      );
  
      const propertyData = {
        ...property.rows[0],
        images: images.rows
      };
  
      res.json(propertyData);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

  // @route   POST api/properties
// @desc    Create a property
// @access  Private
router.post('/', auth, async (req, res) => {
    console.log('Auth middleware passed, user:', req.user);
    
    const {
      title,
      description,
      price,
      bedrooms,
      bathrooms,
      square_feet,
      property_type,
      status,
      address,
      city,
      state,
      zip_code,
      latitude,
      longitude,
      images
    } = req.body;

    console.log('Received property creation request with data:', {
      title,
      description,
      price,
      bedrooms,
      bathrooms,
      square_feet,
      property_type,
      status,
      address,
      city,
      state,
      zip_code,
      latitude,
      longitude,
      images: images ? images.length : 0
    });
  
    try {
      // Check if user is a realtor
      const user = await pool.query(
        'SELECT role FROM users WHERE id = $1',
        [req.user.id]
      );
  
      if (user.rows.length === 0) {
        console.log('User not found:', req.user.id);
        return res.status(401).json({ msg: 'User not found' });
      }
  
      console.log('User role:', user.rows[0].role);
      
      if (user.rows[0].role !== 'agent' && user.rows[0].role !== 'admin') {
        console.log('User not authorized:', req.user.id, user.rows[0].role);
        return res.status(403).json({ 
          msg: 'Only agents can create property listings',
          userRole: user.rows[0].role
        });
      }
  
      // Validate required fields
      const requiredFields = {
        title, description, price, bedrooms, bathrooms, square_feet,
        property_type, status, address, city, state, zip_code
      };
      
      const missingFields = Object.entries(requiredFields)
        .filter(([_, value]) => !value)
        .map(([key]) => key);
      
      if (missingFields.length > 0) {
        console.log('Missing required fields:', missingFields);
        return res.status(400).json({ 
          msg: 'All required fields must be provided',
          missingFields 
        });
      }

      // Validate numeric fields
      const numericFields = {
        price: parseFloat(price),
        bedrooms: parseInt(bedrooms),
        bathrooms: parseFloat(bathrooms),
        square_feet: parseInt(square_feet)
      };

      for (const [field, value] of Object.entries(numericFields)) {
        if (isNaN(value)) {
          console.log(`Invalid numeric value for ${field}:`, price);
          return res.status(400).json({ 
            msg: `Invalid value for ${field}`,
            field,
            value: req.body[field]
          });
        }
      }
  
      // Create property
      const property = await pool.query(
        `INSERT INTO properties (
          title, description, price, bedrooms, bathrooms, square_feet,
          property_type, status, address, city, state, zip_code,
          latitude, longitude, user_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
        [
          title, description, numericFields.price, numericFields.bedrooms, 
          numericFields.bathrooms, numericFields.square_feet,
          property_type, status, address, city, state, zip_code,
          latitude, longitude, req.user.id
        ]
      );
  
      const propertyId = property.rows[0].id;
  
      // Add images
      if (images && images.length > 0) {
        const imageValues = images.map((img, index) => {
          return [propertyId, img, index === 0]; // First image is primary
        });
  
        for (const [propId, imageUrl, isPrimary] of imageValues) {
          await pool.query(
            'INSERT INTO property_images (property_id, image_url, is_primary) VALUES ($1, $2, $3)',
            [propId, imageUrl, isPrimary]
          );
        }
      }
  
      res.json(property.rows[0]);
    } catch (err) {
      console.error('Error creating property:', {
        message: err.message,
        code: err.code,
        detail: err.detail,
        hint: err.hint,
        stack: err.stack
      });
      
      if (err.code === '23505') { // Unique violation
        res.status(400).json({ msg: 'A property with this title already exists' });
      } else if (err.code === '23514') { // Check violation
        res.status(400).json({ msg: 'Invalid data provided. Please check your input values.' });
      } else if (err.code === '22P02') { // Invalid text representation
        res.status(400).json({ msg: 'Invalid data format. Please check your input values.' });
      } else {
        res.status(500).json({ 
          msg: 'Server error while creating property',
          error: err.message,
          code: err.code,
          detail: err.detail
        });
      }
    }
  });

  // @route   PUT api/properties/:id
// @desc    Update a property
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const {
      title,
      description,
      price,
      bedrooms,
      bathrooms,
      square_feet,
      property_type,
      status,
      address,
      city,
      state,
      zip_code,
      latitude,
      longitude,
      images
    } = req.body;
  
    try {
      // Check if property exists
      const propertyCheck = await pool.query(
        'SELECT user_id FROM properties WHERE id = $1',
        [req.params.id]
      );
  
      if (propertyCheck.rows.length === 0) {
        return res.status(404).json({ msg: 'Property not found' });
      }
  
      // Check if user is the property owner or admin
      const user = await pool.query(
        'SELECT role FROM users WHERE id = $1',
        [req.user.id]
      );
  
      if (propertyCheck.rows[0].user_id !== req.user.id && user.rows[0].role !== 'admin') {
        return res.status(403).json({ msg: 'Not authorized to update this property' });
      }
  
      // Update property
      const property = await pool.query(
        `UPDATE properties SET
          title = $1, description = $2, price = $3, bedrooms = $4, bathrooms = $5, square_feet = $6,
          property_type = $7, status = $8, address = $9, city = $10, state = $11, zip_code = $12,
          latitude = $13, longitude = $14
        WHERE id = $15 RETURNING *`,
        [
          title, description, price, bedrooms, bathrooms, square_feet,
          property_type, status, address, city, state, zip_code,
          latitude, longitude, req.params.id
        ]
      );
  
      // Update images if provided
      if (images && images.length > 0) {
        // Delete existing images
        await pool.query('DELETE FROM property_images WHERE property_id = $1', [req.params.id]);
  
        // Add new images
        const imageValues = images.map((img, index) => {
          return [req.params.id, img, index === 0]; // First image is primary
        });
  
        for (const [propId, imageUrl, isPrimary] of imageValues) {
          await pool.query(
            'INSERT INTO property_images (property_id, image_url, is_primary) VALUES ($1, $2, $3)',
            [propId, imageUrl, isPrimary]
          );
        }
      }
  
      res.json(property.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  
  // @route   DELETE api/properties/:id
  // @desc    Delete a property
  // @access  Private
  router.delete('/:id', auth, async (req, res) => {
    try {
      // Check if property exists
      const propertyCheck = await pool.query(
        'SELECT user_id FROM properties WHERE id = $1',
        [req.params.id]
      );
  
      if (propertyCheck.rows.length === 0) {
        return res.status(404).json({ msg: 'Property not found' });
      }
  
      // Check if user is the property owner or admin
      const user = await pool.query(
        'SELECT role FROM users WHERE id = $1',
        [req.user.id]
      );
  
      if (propertyCheck.rows[0].user_id !== req.user.id && user.rows[0].role !== 'admin') {
        return res.status(403).json({ msg: 'Not authorized to delete this property' });
      }
  
      // Delete property (images will be deleted automatically due to CASCADE)
      await pool.query('DELETE FROM properties WHERE id = $1', [req.params.id]);
  
      res.json({ msg: 'Property removed' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  
  // @route   POST api/properties/:id/save
  // @desc    Save a property to user's favorites
  // @access  Private
  router.post('/:id/save', auth, async (req, res) => {
    try {
      // Check if property exists
      const propertyCheck = await pool.query(
        'SELECT id FROM properties WHERE id = $1',
        [req.params.id]
      );
  
      if (propertyCheck.rows.length === 0) {
        return res.status(404).json({ msg: 'Property not found' });
      }
  
      // Check if property is already saved
      const savedCheck = await pool.query(
        'SELECT id FROM saved_properties WHERE user_id = $1 AND property_id = $2',
        [req.user.id, req.params.id]
      );
  
      if (savedCheck.rows.length > 0) {
        return res.status(400).json({ msg: 'Property already saved' });
      }
  
      // Save property
      await pool.query(
        'INSERT INTO saved_properties (user_id, property_id) VALUES ($1, $2)',
        [req.user.id, req.params.id]
      );
  
      res.json({ msg: 'Property saved' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  
  // @route   DELETE api/properties/:id/save
  // @desc    Remove a property from user's favorites
  // @access  Private
  router.delete('/:id/save', auth, async (req, res) => {
    try {
      await pool.query(
        'DELETE FROM saved_properties WHERE user_id = $1 AND property_id = $2',
        [req.user.id, req.params.id]
      );
  
      res.json({ msg: 'Property removed from saved' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

// @route   GET api/properties/saved
// @desc    Get all properties saved by the user
// @access  Private
router.get('/saved', auth, async (req, res) => {
    try {
        // Fetch saved properties for the user
        const savedProperties = await pool.query(
            `SELECT p.*, u.name as agent_name, 
            (SELECT image_url FROM property_images WHERE property_id = p.id AND is_primary = true LIMIT 1) as primary_image
            FROM saved_properties sp
            JOIN properties p ON sp.property_id = p.id
            JOIN users u ON p.user_id = u.id
            WHERE sp.user_id = $1
            ORDER BY sp.created_at DESC`,
            [req.user.id]
        );

        res.json(savedProperties.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;

