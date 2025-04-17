const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString: connectionString,
});

async () =>{
    try{
        const connect = await pool.connect();
        console.log('Connected to the database');
    }
    catch(err){
        console.error('Error connecting to the database', err);
    }
    finally{
        pool.end();
    }
}

module.exports = pool;

