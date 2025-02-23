const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

console.log('Attempting to connect with configuration:');
console.log({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    passwordLength: process.env.DB_PASSWORD ? process.env.DB_PASSWORD.length : 0,
    port: process.env.DB_PORT
});

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
        // Test the connection
        const result = await pool.query('SELECT NOW()');
        console.log('Database connection successful:', result.rows[0]);

        // Read and execute the migration file
        const migrationPath = path.join(__dirname, '../db/migrations/001_create_todos_table.sql');
        console.log('Looking for migration file at:', migrationPath);
        
        if (!fs.existsSync(migrationPath)) {
            throw new Error('Migration file not found at: ' + migrationPath);
        }
        
        const migration = fs.readFileSync(migrationPath, 'utf8');
        console.log('Migration file loaded successfully');
        
        await pool.query(migration);
        console.log('Migration executed successfully');
    } catch (error) {
        console.error('Database initialization error:', error);
        // Log more details about the error
        if (error.code) {
            console.error('Error code:', error.code);
        }
        throw error;
    }
}

module.exports = {
    pool,
    initializeDatabase
};