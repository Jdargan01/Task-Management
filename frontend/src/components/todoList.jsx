import React from 'react';
import { Check, Trash2 } from 'lucide-react';

const TodoList = ({ todos = [], onTodoUpdate, onTodoDelete, onError }) => {
    const formatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getPriorityColor = (priority) => {
        const colors = {
            1: 'bg-red-100 text-red-800',
            2: 'bg-orange-100 text-orange-800',
            3: 'bg-yellow-100 text-yellow-800',
            4: 'bg-blue-100 text-blue-800',
            5: 'bg-green-100 text-green-800'
        };
        return colors[priority] || colors[3];
    };

    // Handler for toggling todo completion
    const handleToggleComplete = (todo) => {
        // Send the update with the expected field structure
        onTodoUpdate(todo.id, {
            title: todo.title,
            description: todo.description,
            completed: !todo.completed,
            due_date: todo.due_date,
            priority: todo.priority
        });
    };

    if (!Array.isArray(todos) || todos.length === 0) {
        return (
            <div className="text-center p-8 bg-white rounded-lg shadow">
                <p className="text-gray-500">No todos yet. Add one to get started!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {todos.map((todo) => (
                <div
                    key={todo.id}
                    className={`p-4 bg-white rounded-lg shadow-sm hover:shadow transition-shadow duration-200 
                              ${todo.completed ? 'opacity-75' : ''}`}
                >
                    <div className="flex items-start gap-4">
                        {/* Completion Toggle */}
                        <button
                            onClick={() => handleToggleComplete(todo)}
                            className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center 
                                      transition-colors duration-200
                                      ${todo.completed
                                        ? 'bg-green-500 border-green-500'
                                        : 'border-gray-300 hover:border-green-500'}`}
                        >
                            {todo.completed && <Check size={16} className="text-white" />}
                        </button>

                        {/* Todo Content */}
                        <div className="flex-1 min-w-0">
                            <h3 className={`font-medium truncate ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                                {todo.title}
                            </h3>
                            
                            {todo.description && (
                                <p className="text-gray-600 mt-1 text-sm">{todo.description}</p>
                            )}
                            
                            <div className="flex flex-wrap gap-2 mt-2">
                                {todo.due_date && (
                                    <span className="text-sm text-gray-500 flex items-center">
                                        Due: {formatDate(todo.due_date)}
                                    </span>
                                )}
                                
                                <span 
                                    className={`text-sm px-2 py-0.5 rounded-full ${getPriorityColor(todo.priority)}`}
                                >
                                    Priority {todo.priority}
                                </span>
                            </div>
                        </div>

                        {/* Delete Button */}
                        <button
                            onClick={() => onTodoDelete(todo.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                            title="Delete todo"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TodoList;
