import React, { useState, useEffect } from 'react';
import TaskCard from './components/TaskCard';
import { getTasks, addTask, updateTaskStatus, deleteTask, performAiSearch } from './services/supabase'; 

const STATUSES = ['To-Do', 'Done']; // Defines the Kanban columns

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState(''); // ⬅️ NEW State for Date
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // AI Search States
  const [aiQuery, setAiQuery] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

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
      // Pass the new date field to the service
      await addTask(newTaskTitle.trim(), newTaskDescription.trim(), newTaskDueDate); 
      setNewTaskTitle(''); 
      setNewTaskDescription('');
      setNewTaskDueDate('');
      await loadTasks();
    } catch (err) {
      setError('Failed to add task: ' + err.message);
    }
  };
  
  // ⬇️ NEW HANDLER for Gemini Search ⬇️
  const handleAiSearch = async (e) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    setAiLoading(true);
    setAiResult('');
    try {
      const result = await performAiSearch(aiQuery.trim());
      setAiResult(result);
      setAiQuery(''); // Clear search box after successful search
    } catch (err) {
      setAiResult("Could not complete AI search.");
      console.error(err);
    } finally {
      setAiLoading(false);
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

  if (loading) return <div style={{textAlign: 'center', padding: '50px'}}>Loading Task Board...</div>;

  return (
    <div className="app-container"> 
      <header>
        <h1>Smart Task Coordinator & AI Assistant</h1>
        <p className="subtitle">Kanban board for project management with integrated Gemini AI Search.</p>
      </header>
      
      {error && <div className="error-message">{error}</div>}

      <div className="utility-section">
        
        {/* Task Creation Form (Small box aesthetic) */}
        <div className="form-container">
          <h2>Add New Task</h2>
          <form onSubmit={handleAddTask}>
            <input
              type="text"
              placeholder="Task Title (Required)"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              required
            />
            <input // ⬅️ NEW DATE INPUT
              type="date"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              aria-label="Due Date"
            />
            <textarea
              placeholder="Description (Optional)"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
            ></textarea>
            <button type="submit" className="submit-button">
              CREATE TASK
            </button>
          </form>
        </div>

        {/* Gemini AI Search Tool (Innovative AI Inclusion) */}
        <div className="ai-search-container">
          <h2>Gemini AI Assistant</h2>
          <form onSubmit={handleAiSearch}>
            <input
              type="text"
              placeholder="e.g., Explain Kanban, How to optimize code"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              disabled={aiLoading}
            />
            <button type="submit" disabled={aiLoading} className="ai-button">
              {aiLoading ? 'Searching...' : 'AI SEARCH'}
            </button>
          </form>
          {aiResult && (
            <div className="ai-result-box">
              <p><strong>AI Response:</strong></p>
              <pre>{aiResult}</pre>
            </div>
          )}
        </div>
      </div>
      
      {/* Kanban Board (Multi-Page/Box Aesthetic) */}
      <div className="kanban-board">
        <h2>Project Board</h2>
        {STATUSES.map(status => (
          <div key={status} className="kanban-column">
            <h3>{status} ({tasks.filter(t => t.status === status).length})</h3>
            <div className="task-list">
              {tasks
                .filter(task => task.status === status)
                .map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onUpdateStatus={handleUpdateStatus}
                    onDelete={handleDeleteTask}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
}

export default App;