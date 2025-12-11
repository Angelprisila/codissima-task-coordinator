import React, { useState, useEffect } from 'react';
import TaskCard from './components/TaskCard';
// Import the service functions we created in Step 6
import { getTasks, addTask, updateTaskStatus, deleteTask } from './services/supabase'; 

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTasks = async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError('Failed to fetch tasks. Check browser console for details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
        alert("Please enter a task title.");
        return;
    } 
    try {
      await addTask(newTaskTitle.trim(), newTaskDescription.trim()); 
      setNewTaskTitle(''); 
      setNewTaskDescription('');
      await loadTasks(); 
    } catch (err) {
      setError('Failed to add task: ' + err.message);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateTaskStatus(id, newStatus); 
      await loadTasks(); 
    } catch (err) {
      setError('Failed to update task.');
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm("Confirm deletion of this task.")) {
        try {
            await deleteTask(id); 
            await loadTasks(); 
        } catch (err) {
            setError('Failed to delete task.');
        }
    }
  };

  if (loading) return <div style={{textAlign: 'center', padding: '50px'}}>Loading Tasks...</div>;

  return (
    <div className="app-container"> 
      <header>
        <h1>Smart Task Coordinator</h1>
        <p className="subtitle">Minimalist coordination platform.</p>
      </header>
      
      {error && (
        <div className="error-message" style={{backgroundColor: '#fed7d7', color: '#c53030', padding: '10px', borderRadius: '4px', marginBottom: '15px'}}>
            Error: {error}
        </div>
      )}

      {/* Task Creation Form */}
      <div className="form-container">
        <h2>Add New Task</h2>
        <form onSubmit={handleAddTask}>
          <input
            type="text"
            placeholder="Task Title (Required)"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <textarea
            placeholder="Description (Optional)"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
          ></textarea>
          <button
            type="submit"
            className="submit-button"
          >
            CREATE TASK
          </button>
        </form>
      </div>

      {/* Task List Section */}
      <div>
        <h2>Task Board ({tasks.length})</h2>
        
        {tasks.length > 0 ? (
          // Grid layout using inline style for two columns
          <div className="task-list-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {tasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onUpdateStatus={handleUpdateStatus}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        ) : (
          <p style={{textAlign: 'center', padding: '30px', backgroundColor: 'white', borderRadius: '8px', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)'}}>
            No tasks found. Get started by adding a new one above!
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
