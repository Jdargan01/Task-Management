// Function to validate if a date is valid and in the future
const isValidDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    return date instanceof Date && !isNaN(date) && date >= now;
};

// Function to build WHERE clause for filtering
const buildWhereClause = (filters) => {
    const conditions = [];
    const values = [];
    let parameterIndex = 1;

    if (filters.userId) {
        conditions.push(`user_id = $${parameterIndex}`);
        values.push(filters.userId);
        parameterIndex++;
    }

    if (filters.status) {
        conditions.push(`completed = $${parameterIndex}`);
        values.push(filters.status === 'completed');
        parameterIndex++;
    }

    if (filters.priority) {
        conditions.push(`priority = $${parameterIndex}`);
        values.push(filters.priority);
        parameterIndex++;
    }

    const whereClause = conditions.length > 0 
        ? 'WHERE ' + conditions.join(' AND ')
        : '';

    return {
        whereClause,
        values
    };
};

// Function to build UPDATE query
const buildUpdateQuery = (fields, startParamIndex = 1) => {
    const updates = [];
    const values = [];
    let parameterIndex = startParamIndex;

    for (const [key, value] of Object.entries(fields)) {
        if (value !== undefined) {
            updates.push(`${key} = $${parameterIndex}`);
            values.push(value);
            parameterIndex++;
        }
    }

    return {
        updateClause: updates.join(', '),
        values
    };
};

// Export all functions
module.exports = {
    isValidDate,
    buildWhereClause,
    buildUpdateQuery
};
