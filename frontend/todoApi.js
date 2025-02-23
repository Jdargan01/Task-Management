// src/services/todoApi.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// For now, we'll hardcode a userId. In a real app, this would come from authentication
const DEFAULT_USER_ID = '1';

export const todoApi = {
    // Fetch all todos with optional filters
    async getTodos({ page = 1, status, priority } = {}) {
        const params = new URLSearchParams({
            userId: DEFAULT_USER_ID,
            page,
            ...(status && { status }),
            ...(priority && { priority })
        });

        const response = await api.get(`/todos?${params}`);
        return response.data;
    },

    // Create a new todo
    async createTodo(todoData) {
        const response = await api.post('/todos', {
            ...todoData,
            userId: DEFAULT_USER_ID
        });
        return response.data;
    },

    // Update a todo
    async updateTodo(id, updates) {
        const response = await api.put(`/todos/${id}?userId=${DEFAULT_USER_ID}`, updates);
        return response.data;
    },

    // Delete a todo
    async deleteTodo(id) {
        await api.delete(`/todos/${id}?userId=${DEFAULT_USER_ID}`);
    },

    // Update multiple todo priorities
    async updatePriorities(updates) {
        const response = await api.post(`/todos/bulk/priorities?userId=${DEFAULT_USER_ID}`, {
            updates
        });
        return response.data;
    }
};