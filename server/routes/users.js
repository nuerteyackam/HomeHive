const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const logActivity = require('../utils/activityLogger');

// Admin middleware
const adminAuth = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admin only.' });
    }
    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/users/admin/all
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get('/admin/all', [auth, adminAuth], async (req, res) => {
  try {
    const users = await pool.query(
      'SELECT id, name, email, role, created_at, is_active FROM users ORDER BY created_at DESC'
    );
    await logActivity(req.user.id, 'VIEW_ALL_USERS', 'Admin viewed all users');
    res.json(users.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/users/admin/create
// @desc    Create a new user (admin only)
// @access  Private/Admin
router.post('/admin/create', [auth, adminAuth], async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user exists
    const userCheck = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userCheck.rows.length > 0) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password, role, is_active) VALUES ($1, $2, $3, $4, true) RETURNING id, name, email, role, created_at, is_active',
      [name, email, hashedPassword, role]
    );

    await logActivity(req.user.id, 'CREATE_USER', `Created new user: ${email} with role: ${role}`);
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/users/admin/:id
// @desc    Update user (admin only)
// @access  Private/Admin
router.put('/admin/:id', [auth, adminAuth], async (req, res) => {
  const { name, email, role, is_active } = req.body;
  const userId = req.params.id;

  try {
    let updateFields = [];
    let queryParams = [];
    let paramCount = 1;
    let changes = [];

    if (name) {
      updateFields.push(`name = $${paramCount}`);
      queryParams.push(name);
      changes.push(`name to ${name}`);
      paramCount++;
    }

    if (email) {
      updateFields.push(`email = $${paramCount}`);
      queryParams.push(email);
      changes.push(`email to ${email}`);
      paramCount++;
    }

    if (role) {
      updateFields.push(`role = $${paramCount}`);
      queryParams.push(role);
      changes.push(`role to ${role}`);
      paramCount++;
    }

    if (typeof is_active === 'boolean') {
      updateFields.push(`is_active = $${paramCount}`);
      queryParams.push(is_active);
      changes.push(`status to ${is_active ? 'active' : 'inactive'}`);
      paramCount++;
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ msg: 'No fields to update' });
    }

    queryParams.push(userId);
    const query = `
      UPDATE users 
      SET ${updateFields.join(', ')} 
      WHERE id = $${paramCount}
      RETURNING id, name, email, role, created_at, is_active
    `;

    const user = await pool.query(query, queryParams);

    if (user.rows.length === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }

    await logActivity(req.user.id, 'UPDATE_USER', `Updated user ${userId}: ${changes.join(', ')}`);
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/users/admin/:id
// @desc    Delete user (admin only)
// @access  Private/Admin
router.delete('/admin/:id', [auth, adminAuth], async (req, res) => {
  try {
    const user = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id, email',
      [req.params.id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }

    await logActivity(req.user.id, 'DELETE_USER', `Deleted user: ${user.rows[0].email}`);
    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/users/admin/activity-logs
// @desc    Get user activity logs (admin only)
// @access  Private/Admin
router.get('/admin/activity-logs', [auth, adminAuth], async (req, res) => {
  try {
    const logs = await pool.query(
      `SELECT al.*, u.name as user_name, u.email 
       FROM activity_logs al
       JOIN users u ON al.user_id = u.id
       ORDER BY al.created_at DESC
       LIMIT 100`
    );
    res.json(logs.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

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