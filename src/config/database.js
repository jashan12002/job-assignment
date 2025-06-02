const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pool.connect((err, client, release) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
    } else {
        console.log('Successfully connected to database');
        client.query('SELECT to_regclass(\'public.users\')', (err, result) => {
            release();
            if (err) {
                console.error('Error checking users table:', err.stack);
            } else if (!result.rows[0].to_regclass) {
                console.error('Users table does not exist. Creating table...');
                createUsersTable();
            } else {
                console.log('Users table exists');
            }
        });
    }
});

async function createUsersTable() {
    try {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await pool.query(createTableQuery);
        console.log('Users table created successfully');
    } catch (err) {
        console.error('Error creating users table:', err.stack);
    }
}

module.exports = pool; 