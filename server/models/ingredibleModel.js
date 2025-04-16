const { Pool } = require('pg');
require('dotenv').config();

const PG_URI = process.env.DATABASE_URI;

const pool = new Pool({
    connectionString: PG_URI,
});

const query = (text, params) => {
    console.log('Executed query:', text);
    return pool.query(text, params || []);
};

module.exports = {
    pool,
    query,
};