import React from 'react';

// Utility to calculate urgency based on due date
function getUrgency(dueDate) {
  if (!dueDate) return '';
  const dueTime = new Date(dueDate).getTime();
  const now = new Date().getTime();
  const diffDays = Math.ceil((dueTime - now) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'overdue';
  if (diffDays <= 2) return 'urgent';
  if (diffDays <= 7) return 'priority';
  return '';
}

const TaskCard = ({ task, onUpdateStatus, onDelete }) => {
  const statusClass = `status-${task.status.replace(/\s/g, '')}` || 'status-default';
  const urgencyClass = getUrgency(task.due_date);
  
  // Format the date for display
  const formattedDate = task.due_date 
    ? new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
    : 'No Due Date';

  return (
    <div className={`task-card ${statusClass}`}>
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <span className={`status-badge ${statusClass}`}>
          {task.status}
        </span>
      </div>
      
      <p className="task-description">
        {task.description || 'No description provided.'}
      </p>
      
      {/* Display Date and Urgency */}
      <div className={`task-footer ${urgencyClass}`}>
        <span className="due-date">
          📅 {formattedDate}
        </span>
        {/* Innovative way to display remaining time based on urgency */}
        {task.status !== 'Done' && (
          <span className="time-remaining">
            {urgencyClass === 'overdue' ? 'OVERDUE' : urgencyClass === 'urgent' ? '2 DAYS LEFT' : urgencyClass === 'priority' ? 'WEEK LEFT' : ''}
          </span>
        )}
      </div>

      <div className="task-actions">
        {/* Only show "Mark Done" if not done */}
        {task.status !== 'Done' && (
          <button 
            onClick={() => onUpdateStatus(task.id, 'Done')}
            className="btn-done"
          >
            Mark Done
          </button>
        )}

        {/* Delete Button */}
        <button 
          onClick={() => onDelete(task.id)}
          className="btn-delete"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;