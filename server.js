// server.js
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const todoRoutes = require('./routes/todoRoutes');

// Initialize express application
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(cors());                 // Enable CORS for all routes
app.use(express.json());         // Parse JSON request bodies
app.use(morgan('dev'));          // HTTP request logging

// Mount the todo routes under the /api/todos path
app.use('/api/todos', todoRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    
    // Provide error information in development
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal server error',
            status: err.status || 500,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        }
    });
});

// Handle 404 errors for unmatched routes
app.use((req, res) => {
    res.status(404).json({
        error: {
            message: 'Route not found',
            status: 404
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});