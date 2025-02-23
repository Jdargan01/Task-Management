const { isValidDate } = require('../utils/dateUtils');

// Middleware to validate todo creation and updates
const validateTodo = (req, res, next) => {
    const { title, description, dueDate, priority } = req.body;
    
    const errors = [];

    // Title validation
    if (!title) {
        errors.push('Title is required');
    } else if (title.length > 255) {
        errors.push('Title must be less than 255 characters');
    }

    // Description validation (optional field)
    if (description && description.length > 1000) {
        errors.push('Description must be less than 1000 characters');
    }

    // Priority validation
    if (priority !== undefined) {
        const priorityNum = Number(priority);
        if (!Number.isInteger(priorityNum) || priorityNum < 1 || priorityNum > 5) {
            errors.push('Priority must be an integer between 1 and 5');
        }
    }

    // Due date validation (if provided)
    if (dueDate) {
        try {
            if (!isValidDate(dueDate)) {
                errors.push('Due date must be a valid future date');
            }
        } catch (err) {
            errors.push('Invalid date format');
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({
            error: 'Validation failed',
            details: errors
        });
    }

    next();
};

// Middleware to validate query parameters
const validateQueryParams = (req, res, next) => {
    const { userId, status, priority } = req.query;

    const errors = [];

    if (!userId) {
        errors.push('userId is required');
    }

    if (status && !['pending', 'completed'].includes(status)) {
        errors.push('Status must be either pending or completed');
    }

    if (priority) {
        const priorityNum = Number(priority);
        if (!Number.isInteger(priorityNum) || priorityNum < 1 || priorityNum > 5) {
            errors.push('Priority must be an integer between 1 and 5');
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({
            error: 'Invalid query parameters',
            details: errors
        });
    }

    next();
};

module.exports = {
    validateTodo,
    validateQueryParams
};
