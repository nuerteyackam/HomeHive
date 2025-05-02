const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString: connectionString,
});

// Test the connection
pool.connect()
    .then(() => console.log('Connected to the database'))
    .catch((err) => {
        console.error('Error connecting to the database', err);
        process.exit(1); // Exit the process if the database connection fails
    });

module.exports = pool;

