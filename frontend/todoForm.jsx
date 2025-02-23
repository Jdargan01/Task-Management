import React, { useState } from 'react';
import { Plus, Calendar } from 'lucide-react';

const TodoForm = ({ onAddTodo }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState(3);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Create the new todo object with the correct field names
            const newTodo = {
                title,
                description,
                due_date: dueDate,
                priority: Number(priority),
                userId: 1
            };

            // Call the parent component's handler
            await onAddTodo(newTodo);

            // Reset form on success
            setTitle('');
            setDescription('');
            setDueDate('');
            setPriority(3);
        } catch (error) {
            console.error('Failed to add todo:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow">
            <div>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What needs to be done?"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                />
            </div>
            
            <div className="flex gap-4">
                <div className="flex-1">
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Add details..."
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="2"
                    />
                </div>
                
                <div className="flex gap-2">
                    <div className="relative">
                        <Calendar className="absolute left-2 top-2 text-gray-400" size={20} />
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="pl-8 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value={1}>High</option>
                        <option value={2}>Medium High</option>
                        <option value={3}>Medium</option>
                        <option value={4}>Medium Low</option>
                        <option value={5}>Low</option>
                    </select>
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
                <Plus size={20} />
                {isSubmitting ? 'Adding...' : 'Add Todo'}
            </button>
        </form>
    );
};

export default TodoForm;