const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const { validateTodo, validateQueryParams } = require('../middleware/validationMiddleware');

// Get all todos with filtering
router.get('/', validateQueryParams, todoController.getAllTodos);

// Get a single todo
router.get('/:id', validateQueryParams, todoController.getTodoById);

// Create a new todo
router.post('/', validateTodo, todoController.createTodo);

// Update a todo
router.put('/:id', validateTodo, todoController.updateTodo);

// Delete a todo
router.delete('/:id', validateQueryParams, todoController.deleteTodo);

// Bulk update priorities
router.post('/bulk/priorities', validateQueryParams, todoController.bulkUpdatePriorities);

module.exports = router;