import React from 'react';

export default function TaskStats({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const active = total - completed;
  
  // Calculate overdue tasks: not completed, has a due date, and due date is in the past
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const overdue = tasks.filter(t => {
    if (t.completed || !t.dueDate) return false;
    const dueDate = new Date(t.dueDate);
    return dueDate < today;
  }).length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Card */}
      <div className="glass-card rounded-2xl p-3 sm:p-4 flex items-center space-x-2 sm:space-x-4 min-w-0">
        <div className="p-2 sm:p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 flex-shrink-0">
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 truncate">Total</p>
          <p className="text-xl sm:text-2xl font-bold font-sans tracking-tight truncate">{total}</p>
        </div>
      </div>

      {/* Active Card */}
      <div className="glass-card rounded-2xl p-3 sm:p-4 flex items-center space-x-2 sm:space-x-4 min-w-0">
        <div className="p-2 sm:p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 flex-shrink-0">
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 truncate">Active</p>
          <p className="text-xl sm:text-2xl font-bold font-sans tracking-tight truncate">{active}</p>
        </div>
      </div>

      {/* Completed Card */}
      <div className="glass-card rounded-2xl p-3 sm:p-4 flex items-center space-x-2 sm:space-x-4 min-w-0">
        <div className="p-2 sm:p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 flex-shrink-0">
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 truncate">Completed</p>
          <p className="text-xl sm:text-2xl font-bold font-sans tracking-tight truncate">{completed}</p>
        </div>
      </div>

      {/* Overdue Card */}
      <div className={`glass-card rounded-2xl p-3 sm:p-4 flex items-center space-x-2 sm:space-x-4 min-w-0 transition-all ${overdue > 0 ? 'bg-red-500/5 border-red-200 dark:border-red-900/50' : ''}`}>
        <div className={`p-2 sm:p-3 rounded-xl flex-shrink-0 ${overdue > 0 ? 'bg-red-500/20 text-red-600 dark:text-red-400 animate-pulse' : 'bg-rose-500/10 text-rose-500 dark:bg-rose-500/20'}`}>
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 truncate">Overdue</p>
          <p className={`text-xl sm:text-2xl font-bold font-sans tracking-tight truncate ${overdue > 0 ? 'text-red-600 dark:text-red-400' : ''}`}>{overdue}</p>
        </div>
      </div>
    </div>
  );
}
