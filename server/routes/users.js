const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// @route   GET api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await pool.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let updateFields = [];
    let queryParams = [];
    let paramCount = 1;

    if (name) {
      updateFields.push(`name = $${paramCount}`);
      queryParams.push(name);
      paramCount++;
    }

    if (email) {
      updateFields.push(`email = $${paramCount}`);
      queryParams.push(email);
      paramCount++;
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateFields.push(`password = $${paramCount}`);
      queryParams.push(hashedPassword);
      paramCount++;
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ msg: 'No fields to update' });
    }

    queryParams.push(req.user.id);
    const query = `
      UPDATE users 
      SET ${updateFields.join(', ')} 
      WHERE id = $${paramCount}
      RETURNING id, name, email, role, created_at
    `;

    const user = await pool.query(query, queryParams);

    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/users/saved-properties
// @desc    Get user's saved properties
// @access  Private
router.get('/saved-properties', auth, async (req, res) => {
    try {
      const savedProperties = await pool.query(
        `SELECT p.*, sp.created_at as saved_at,
         (SELECT image_url FROM property_images WHERE property_id = p.id AND is_primary = true LIMIT 1) as primary_image
         FROM saved_properties sp
         JOIN properties p ON sp.property_id = p.id
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
  
  // @route   GET api/users/properties
  // @desc    Get user's properties (listings)
  // @access  Private
  router.get('/properties', auth, async (req, res) => {
    try {
      const properties = await pool.query(
        `SELECT p.*,
         (SELECT image_url FROM property_images WHERE property_id = p.id AND is_primary = true LIMIT 1) as primary_image
         FROM properties p
         WHERE p.user_id = $1
         ORDER BY p.created_at DESC`,
        [req.user.id]
      );
  
      res.json(properties.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  
  module.exports = router;