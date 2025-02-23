import React, { useState, useEffect } from 'react';
import { AlertCircle, Filter } from 'lucide-react';


import TodoForm from './components/todoForm';
import TodoList from './components/todoList';


function App() {
    const [todos, setTodos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        status: '',
        priority: '',
        page: 1
    });

    // Fetch todos when component mounts or filters change
    useEffect(() => {
        fetchTodos();
    }, [filters]);

    const fetchTodos = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`http://localhost:3000/api/todos?userId=1${
                filters.status ? `&status=${filters.status}` : ''
            }${
                filters.priority ? `&priority=${filters.priority}` : ''
            }&page=${filters.page}`);
            
            if (!response.ok) throw new Error('Failed to fetch todos');
            const data = await response.json();
            setTodos(data.todos);
            setError(null);
        } catch (err) {
            setError('Failed to fetch todos: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddTodo = async (newTodo) => {
        try {
            const response = await fetch('http://localhost:3000/api/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...newTodo, userId: 1 }),
            });

            if (!response.ok) throw new Error('Failed to add todo');
            await fetchTodos();
            setError(null);
        } catch (err) {
            setError('Failed to add todo: ' + err.message);
        }
    };

    const handleUpdateTodo = async (id, updates) => {
        try {
            const response = await fetch(`http://localhost:3000/api/todos/${id}?userId=1`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates),
            });

            if (!response.ok) throw new Error('Failed to update todo');
            await fetchTodos();
            setError(null);
        } catch (err) {
            setError('Failed to update todo: ' + err.message);
        }
    };

    const handleDeleteTodo = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/todos/${id}?userId=1`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete todo');
            await fetchTodos();
            setError(null);
        } catch (err) {
            setError('Failed to delete todo: ' + err.message);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters,
            page: 1 // Reset page when filters change
        }));
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Todo List</h1>
                    <p className="mt-2 text-gray-600">
                        Stay organized and boost your productivity
                    </p>
                </header>

                {/* Filter Section */}
                <section className="mb-6 bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center gap-4">
                        <Filter size={20} className="text-gray-400" />
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange({ status: e.target.value })}
                            className="p-2 border rounded"
                        >
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                        </select>

                        <select
                            value={filters.priority}
                            onChange={(e) => handleFilterChange({ priority: e.target.value })}
                            className="p-2 border rounded"
                        >
                            <option value="">All Priorities</option>
                            <option value="1">High</option>
                            <option value="2">Medium High</option>
                            <option value="3">Medium</option>
                            <option value="4">Medium Low</option>
                            <option value="5">Low</option>
                        </select>
                    </div>
                </section>

                {/* Error Display */}
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                {/* Todo Form */}
                <section className="mb-8">
                    <TodoForm onAddTodo={handleAddTodo} />
                </section>

                {/* Todo List */}
                <section>
                    {isLoading ? (
                        <div className="text-center py-4 text-gray-600">
                            Loading your todos...
                        </div>
                    ) : (
                        <TodoList 
                            todos={todos}
                            onTodoUpdate={handleUpdateTodo}
                            onTodoDelete={handleDeleteTodo}
                            onError={setError}
                        />
                    )}
                </section>
            </div>
        </div>
    );
}

export default App;
