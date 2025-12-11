import React from 'react';

const TaskCard = ({ task, onUpdateStatus, onDelete }) => {
  // Map Supabase status value to a CSS class defined in src/style.css
  const statusClass = `status-${task.status.replace(/\s/g, '')}` || 'status-default';

  return (
    <div className="task-card">
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <span className={`status-badge ${statusClass}`}>
          {task.status}
        </span>
      </div>
      
      <p className="task-description">
        {task.description || 'No description provided.'}
      </p>
      
      <div className="task-actions">
        
        {/* Mark Done Button */}
        {task.status !== 'Done' && (
          <button 
            onClick={() => onUpdateStatus(task.id, 'Done')}
            style={{backgroundColor: '#38a169', color: 'white'}} // Green button
          >
            Mark Done
          </button>
        )}

        {/* Delete Button */}
        <button 
          onClick={() => onDelete(task.id)}
          style={{backgroundColor: '#e53e3e', color: 'white'}} // Red button
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;