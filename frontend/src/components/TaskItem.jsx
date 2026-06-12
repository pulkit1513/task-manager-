import React from 'react';

export default function TaskItem({ 
  task, 
  index, 
  onToggle, 
  onEdit, 
  onDelete, 
  onDragStart, 
  onDragOver, 
  onDragEnd, 
  onDrop,
  draggedIndex
}) {
  const { title, description, dueDate, completed, createdAt } = task;

  // Check if overdue
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isOverdue = !completed && dueDate && new Date(dueDate) < today;

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isDragging = draggedIndex === index;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDragEnd={onDragEnd}
      onDrop={(e) => onDrop(e, index)}
      className={`glass-card rounded-2xl p-4 mb-3 cursor-grab active:cursor-grabbing transition-all duration-300 ${
        isDragging ? 'opacity-40 scale-[0.98] border-dashed border-blue-400 dark:border-blue-500' : ''
      } ${
        completed ? 'bg-slate-50/50 dark:bg-slate-900/30 opacity-70' : ''
      } ${
        isOverdue ? 'border-l-4 border-l-red-500 dark:border-l-red-500' : 'border-l-4 border-l-transparent'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left Action: Toggle & Content */}
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          <button
            onClick={() => onToggle(task.id)}
            className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
              completed
                ? 'bg-emerald-500 border-emerald-500 text-white'
                : isOverdue
                ? 'border-red-400 dark:border-red-500 hover:bg-red-500/10'
                : 'border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-500/5'
            }`}
            aria-label={completed ? 'Mark task as incomplete' : 'Mark task as complete'}
          >
            {completed && (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          <div className="flex-1 min-w-0">
            {/* Title */}
            <h4 className={`font-semibold text-slate-800 dark:text-slate-200 transition-all truncate text-[15px] ${
              completed ? 'line-through text-slate-400 dark:text-slate-500' : ''
            }`}>
              {title}
            </h4>

            {/* Description */}
            {description && (
              <p className={`text-xs mt-1 text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed ${
                completed ? 'text-slate-400 dark:text-slate-500' : ''
              }`}>
                {description}
              </p>
            )}

            {/* Badges & Date */}
            <div className="flex flex-wrap items-center gap-2 mt-3 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {/* Drag indicator icon */}
              <span className="text-slate-300 dark:text-slate-700 select-none mr-1 flex items-center">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.5 6a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0 6a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0 6a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm6-12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0 6a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0 6a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                </svg>
              </span>

              {/* Due Date badge */}
              {dueDate && (
                <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${
                  completed
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                    : isOverdue
                    ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDate(dueDate)}
                </span>
              )}

              {/* Overdue Badge */}
              {isOverdue && (
                <span className="px-2 py-0.5 rounded-full bg-red-500 text-white font-semibold uppercase tracking-wider text-[9px] animate-pulse">
                  Overdue
                </span>
              )}

              {/* Completed Badge */}
              {completed && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider text-[9px]">
                  Done
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Actions: Edit & Delete */}
        <div className="flex items-center space-x-1 flex-shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Edit Task"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(task.id, title)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
            title="Delete Task"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
