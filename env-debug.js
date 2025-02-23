const path = require('path');
const fs = require('fs');

// Log the current working directory
console.log('Current working directory:', process.cwd());

// Check if .env exists in the current directory
console.log('.env exists in current directory:', fs.existsSync('.env'));

// Check if .env exists in the parent directory
console.log('.env exists in parent directory:', fs.existsSync('../.env'));

// Try to read the .env file content
try {
    const envContent = fs.readFileSync('.env', 'utf8');
    console.log('\n.env file content:');
    console.log(envContent);
} catch (error) {
    console.log('\nError reading .env file:', error.message);
}

// Initialize dotenv and check variables
require('dotenv').config();
console.log('\nEnvironment variables after dotenv:');
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PASSWORD length:', process.env.DB_PASSWORD ? process.env.DB_PASSWORD.length : 0);
console.log('DB_PORT:', process.env.DB_PORT);