// controllers/todoController.js
const { pool } = require('../config/database');
const { buildWhereClause, buildUpdateQuery } = require('../utils/dateUtils');

class TodoController {
    // Get todos with filtering
    async getAllTodos(req, res, next) {
        try {
            const { userId, status, priority, page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;

            // Build the WHERE clause based on filters
            const { whereClause, values } = buildWhereClause({ userId, status, priority });

            // Get total count
            const countResult = await pool.query(
                `SELECT COUNT(*) FROM todos ${whereClause}`,
                values
            );
            const totalCount = parseInt(countResult.rows[0].count);

            // Get results
            const result = await pool.query(
                `SELECT * FROM todos 
                 ${whereClause}
                 ORDER BY priority ASC, due_date ASC
                 LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
                [...values, limit, offset]
            );

            res.json({
                todos: result.rows,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalCount / limit),
                    totalItems: totalCount,
                    itemsPerPage: limit
                }
            });
        } catch (err) {
            next(err);
        }
    }

    // Get a single todo by ID
    async getTodoById(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.query.userId;

            const result = await pool.query(
                'SELECT * FROM todos WHERE id = $1 AND user_id = $2',
                [id, userId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({
                    error: 'Todo not found',
                    details: 'The requested todo does not exist or belongs to another user'
                });
            }

            res.json(result.rows[0]);
        } catch (err) {
            next(err);
        }
    }

    // Create a new todo
    async createTodo(req, res, next) {
        try {
            const { title, description, userId, dueDate, priority } = req.body;

            const result = await pool.query(
                `INSERT INTO todos (
                    title, description, user_id, due_date, priority
                ) VALUES ($1, $2, $3, $4, $5)
                RETURNING *`,
                [title, description, userId, dueDate, priority]
            );
            
            res.status(201).json(result.rows[0]);
        } catch (err) {
            next(err);
        }
    }

    // Update a todo
    async updateTodo(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.query.userId;
            const updateFields = {
                title: req.body.title,
                description: req.body.description,
                completed: req.body.completed,
                due_date: req.body.dueDate,
                priority: req.body.priority
            };

            // Build the update query dynamically
            const { updateClause, values } = buildUpdateQuery(updateFields);
            
            const result = await pool.query(
                `UPDATE todos 
                 SET ${updateClause}
                 WHERE id = $${values.length + 1} AND user_id = $${values.length + 2}
                 RETURNING *`,
                [...values, id, userId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({
                    error: 'Todo not found',
                    details: 'The requested todo does not exist or belongs to another user'
                });
            }

            res.json(result.rows[0]);
        } catch (err) {
            next(err);
        }
    }

    // Delete a todo
    async deleteTodo(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.query.userId;

            const result = await pool.query(
                'DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING *',
                [id, userId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({
                    error: 'Todo not found',
                    details: 'The requested todo does not exist or belongs to another user'
                });
            }

            res.status(204).send();
        } catch (err) {
            next(err);
        }
    }

    // Bulk operations
    async bulkUpdatePriorities(req, res, next) {
        try {
            const { updates } = req.body;
            const userId = req.query.userId;

            // Start a transaction
            const client = await pool.connect();
            try {
                await client.query('BEGIN');

                for (const update of updates) {
                    await client.query(
                        'UPDATE todos SET priority = $1 WHERE id = $2 AND user_id = $3',
                        [update.priority, update.id, userId]
                    );
                }

                await client.query('COMMIT');
                res.json({ message: 'Priorities updated successfully' });
            } catch (err) {
                await client.query('ROLLBACK');
                throw err;
            } finally {
                client.release();
            }
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new TodoController();
