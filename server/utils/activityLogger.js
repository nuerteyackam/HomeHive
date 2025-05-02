const pool = require('../db');

const logActivity = async (userId, action, details = null) => {
    try {
        await pool.query(
            'INSERT INTO activity_logs (user_id, action, details) VALUES ($1, $2, $3)',
            [userId, action, details]
        );
    } catch (err) {
        console.error('Error logging activity:', err);
        // Don't throw the error - we don't want logging failures to break the main functionality
    }
};

module.exports = logActivity; 