const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Create a new Pool instance with the database credentials
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Function to initialize the database
async function initializeDatabase() {
    try {
        // test the connection
        await pool.query('SELECT NOW()');
        console.log('Database connection successful');

        // Read and execute the migratin file
        const migrationPath = path.join(__dirname, '../db/migrations/001_create_todos_table.sql');
        const migration = fs.readFileSync(migrationPath, 'utf8');

        await pool.query(migration);
        console.log('Migration executed successfully');
    } catch (error) {
        console.log('Database initialization error: ', error);
        throw error;
    }
}

module.exports = {
    pool,
    initializeDatabase
};
