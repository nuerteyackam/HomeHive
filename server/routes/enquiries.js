const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// @route   POST api/enquiries
// @desc    Create an enquiry
// @access  Public or Private
router.post('/', async (req, res) => {
  const { property_id, name, email, phone, message } = req.body;
  
  // Get user_id if authenticated
  let user_id = null;
  if (req.headers['x-auth-token']) {
    try {
      const decoded = jwt.verify(req.headers['x-auth-token'], process.env.JWT_SECRET);
      user_id = decoded.user.id;
    } catch (err) {
      // Token invalid, continue as unauthenticated
    }
  }

  try {
    // Check if property exists
    const propertyCheck = await pool.query(
      'SELECT id FROM properties WHERE id = $1',
      [property_id]
    );

    if (propertyCheck.rows.length === 0) {
      return res.status(404).json({ msg: 'Property not found' });
    }

    // Create enquiry
    const enquiry = await pool.query(
      `INSERT INTO enquiries (property_id, user_id, name, email, phone, message)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [property_id, user_id, name, email, phone, message]
    );

    res.json(enquiry.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/enquiries
// @desc    Get all enquiries for a user's properties
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Get user role
    const user = await pool.query(
      'SELECT role FROM users WHERE id = $1',
      [req.user.id]
    );

    let query;
    
    if (user.rows[0].role === 'admin') {
      // Admins can see all enquiries
      query = await pool.query(
        `SELECT e.*, p.title as property_title
         FROM enquiries e
         JOIN properties p ON e.property_id = p.id
         ORDER BY e.created_at DESC`
      );
    } else {
      // Regular users can only see enquiries for their properties
      query = await pool.query(
        `SELECT e.*, p.title as property_title
         FROM enquiries e
         JOIN properties p ON e.property_id = p.id
         WHERE p.user_id = $1
         ORDER BY e.created_at DESC`,
        [req.user.id]
      );
    }

    res.json(query.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/enquiries/:id
// @desc    Update enquiry status
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { status } = req.body;

  try {
    // Get enquiry
    const enquiryCheck = await pool.query(
      `SELECT e.*, p.user_id as property_owner
       FROM enquiries e
       JOIN properties p ON e.property_id = p.id
       WHERE e.id = $1`,
      [req.params.id]
    );

    if (enquiryCheck.rows.length === 0) {
      return res.status(404).json({ msg: 'Enquiry not found' });
    }

    // Check if user owns the property associated with the enquiry
    const user = await pool.query(
      'SELECT role FROM users WHERE id = $1',
      [req.user.id]
    );

    if (enquiryCheck.rows[0].property_owner !== req.user.id && user.rows[0].role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to update this enquiry' });
    }

    // Update enquiry status
    const enquiry = await pool.query(
      'UPDATE enquiries SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );

    res.json(enquiry.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;