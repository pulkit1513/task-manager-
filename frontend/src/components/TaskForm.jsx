import React, { useState, useEffect } from 'react';

export default function TaskForm({ onSubmit, editingTask, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  // Sync state if editingTask changes
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setDescription(editingTask.description || '');
      setDueDate(editingTask.dueDate ? editingTask.dueDate.substring(0, 10) : '');
      setError('');
    } else {
      resetForm();
    }
  }, [editingTask]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate || null
    });
    
    resetForm();
  };

  return (
    <div className="glass-panel rounded-2xl p-5 shadow-lg mb-6 transition-all border border-slate-200/50 dark:border-slate-800/50">
      <h3 className="text-lg font-bold mb-4 font-sans tracking-tight flex items-center gap-2">
        {editingTask ? (
          <>
            <span className="flex h-2 w-2 rounded-full bg-amber-500"></span>
            Edit Task
          </>
        ) : (
          <>
            <span className="flex h-2 w-2 rounded-full bg-blue-500"></span>
            Add New Task
          </>
        )}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="task-title" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="task-title"
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (e.target.value.trim()) setError('');
            }}
            className={`w-full px-4 py-2 rounded-xl border ${
              error ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 dark:border-slate-800 focus:ring-blue-500/20 focus:border-blue-500'
            } bg-white dark:bg-slate-900 focus:ring-2 outline-none transition-all text-sm dark:text-slate-200`}
          />
          {error && <p className="text-xs text-red-500 mt-1 font-medium">{error}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="task-desc" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Description
          </label>
          <textarea
            id="task-desc"
            placeholder="Add some details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm dark:text-slate-200 resize-none"
          />
        </div>

        {/* Due Date */}
        <div>
          <label htmlFor="task-due" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Due Date
          </label>
          <input
            id="task-due"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm dark:text-slate-200"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2">
          {editingTask && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className={`px-5 py-2 rounded-xl text-sm font-medium text-white shadow-md transition-all hover:-translate-y-0.5 ${
              editingTask
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-amber-500/10'
                : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-blue-500/10'
            }`}
          >
            {editingTask ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
}
