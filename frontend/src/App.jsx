import React, { useState, useEffect } from 'react';
import TaskStats from './components/TaskStats';
import FilterBar from './components/FilterBar';
import TaskForm from './components/TaskForm';
import TaskItem from './components/TaskItem';

 const API_BASE = 'https://task-manager-5c9w.onrender.com/api';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter and Search states
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  
  // Editing state
  const [editingTask, setEditingTask] = useState(null);
  
  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Drag and drop states
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Sync Dark Mode with DOM
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Fetch initial tasks
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/tasks`);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      setTasks(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Could not connect to the backend server. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (taskData) => {
    try {
      if (editingTask) {
        // Update
        const res = await fetch(`${API_BASE}/tasks/${editingTask.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData)
        });
        if (!res.ok) throw new Error('Failed to update task');
        const updated = await res.json();
        setTasks(tasks.map(t => t.id === editingTask.id ? updated : t));
        setEditingTask(null);
      } else {
        // Create
        const res = await fetch(`${API_BASE}/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData)
        });
        if (!res.ok) throw new Error('Failed to create task');
        const created = await res.json();
        // Backend prepends created tasks to display newest first
        setTasks([created, ...tasks]);
      }
    } catch (err) {
      console.error(err);
      alert('Error saving task');
    }
  };

  const handleToggleComplete = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed })
      });
      if (!res.ok) throw new Error('Failed to toggle completion');
      const updated = await res.json();
      setTasks(tasks.map(t => t.id === id ? updated : t));
    } catch (err) {
      console.error(err);
      alert('Error updating task status');
    }
  };

  const handleDelete = async (id, title) => {
    const confirmed = window.confirm(`Are you sure you want to delete the task "${title}"?`);
    if (!confirmed) return;

    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete task');
      setTasks(tasks.filter(t => t.id !== id));
      if (editingTask?.id === id) {
        setEditingTask(null);
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting task');
    }
  };

  // Drag and Drop Event Handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Required for Firefox
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleDrop = async (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const reordered = [...tasks];
    const [draggedItem] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIndex, 0, draggedItem);

    // Update local state immediately for snappy UI feel
    setTasks(reordered);

    try {
      const res = await fetch(`${API_BASE}/tasks/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskIds: reordered.map(t => t.id) })
      });
      if (!res.ok) throw new Error('Failed to persist order');
      const savedTasks = await res.json();
      setTasks(savedTasks);
    } catch (err) {
      console.error('Error saving reordered tasks:', err);
      // Revert to original state on failure
      fetchTasks();
    }
  };

  // Filter & Search tasks
  const filteredTasks = tasks.filter(task => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'active' && !task.completed) || 
      (filter === 'completed' && task.completed);
      
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-300">
      {/* Glow effects for modern look */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-600/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20 font-bold text-xl">
              T
            </span>
            <div>
              <h1 className="text-xl font-bold tracking-tight font-sans">TaskFlow</h1>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">PERSONAL TASK MANAGER</p>
            </div>
          </div>
          
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
            aria-label="Toggle Dark/Light Mode"
          >
            {darkMode ? (
              // Sun Icon
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m2.828-9.9a5 5 0 117.071 7.071l-7.071-7.071z" />
              </svg>
            ) : (
              // Moon Icon
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 relative z-10">
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button onClick={fetchTasks} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors">
              Retry Connection
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="md:col-span-1">
            <div className="sticky top-24">
              <TaskForm
                onSubmit={handleCreateOrUpdate}
                editingTask={editingTask}
                onCancel={() => setEditingTask(null)}
              />
            </div>
          </div>

          {/* List & Stats Section */}
          <div className="md:col-span-2">
            <TaskStats tasks={tasks} />
            
            <FilterBar
              filter={filter}
              setFilter={setFilter}
              search={search}
              setSearch={setSearch}
            />

            {/* Tasks Container */}
            <div className="space-y-3">
              {loading ? (
                // Loader
                <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500">
                  <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-sm font-medium">Fetching your tasks...</p>
                </div>
              ) : filteredTasks.length > 0 ? (
                <div className="transition-all duration-300">
                  {filteredTasks.map((task, idx) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      index={idx}
                      draggedIndex={draggedIndex}
                      onToggle={handleToggleComplete}
                      onEdit={setEditingTask}
                      onDelete={handleDelete}
                      onDragStart={handleDragStart}
                      onDragOver={handleDragOver}
                      onDragEnd={handleDragEnd}
                      onDrop={handleDrop}
                    />
                  ))}
                  {/* Reorder instructions (nice visual micro-animation/help) */}
                  <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 mt-4 select-none">
                    💡 Drag and drop tasks to custom reorder them.
                  </p>
                </div>
              ) : (
                // Empty State UI
                <div className="glass-card rounded-2xl py-16 px-4 text-center border border-dashed border-slate-200 dark:border-slate-800">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400 dark:text-slate-600">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                    {tasks.length === 0 ? 'Start with a clean slate' : 'No tasks match filter'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                    {tasks.length === 0
                      ? 'Add your first task in the form to get started organizing your day.'
                      : 'Try resetting your status filter or clearing your search term.'}
                  </p>
                  {tasks.length > 0 && (
                    <button
                      onClick={() => {
                        setFilter('all');
                        setSearch('');
                      }}
                      className="mt-4 px-4 py-1.5 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200/30 dark:border-slate-950/20 text-center text-xs text-slate-400 dark:text-slate-600 mt-12 bg-white/10 dark:bg-slate-950/10">
        <p>© 2026 TaskFlow. Made with ⚡ for organizing your productivity.</p>
      </footer>
    </div>
  );
}
