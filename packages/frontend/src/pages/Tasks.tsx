import React, { useState, useEffect } from 'react';
import { 
  getAllTasks, 
  getMyTasks, 
  getSharedTasks,
  createTask,
  updateTask,
  toggleTaskCompletion,
  deleteTask,
  shareTask,
} from '../services/tasks';
import type  { Task } from '../services/tasks';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import TaskItem from '../components/TaskItem';
import TaskForm from '../components/TaskForm';
import ShareTaskForm from '../components/ShareTaskForm';
import { signOut } from '../services/auth';

type FilterType = 'all' | 'my' | 'shared';

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToShare, setTaskToShare] = useState<Task | null>(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    fetchTasks();
  }, [user, filter, navigate]);
  
  const fetchTasks = async () => {
    try {
      setLoading(true);
      let fetchedTasks: Task[];
      
      switch (filter) {
        case 'my':
          fetchedTasks = await getMyTasks();
          break;
        case 'shared':
          fetchedTasks = await getSharedTasks();
          break;
        default:
          fetchedTasks = await getAllTasks();
      }
      
      setTasks(fetchedTasks);
      setError('');
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateTask = async (data: { title: string; description?: string }) => {
    try {
      await createTask(data);
      setShowCreateForm(false);
      fetchTasks();
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Failed to create task. Please try again.');
    }
  };
  
  const handleUpdateTask = async (id: string, data: { title: string; description?: string }) => {
    try {
      await updateTask(id, data);
      setTaskToEdit(null);
      fetchTasks();
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task. Please try again.');
    }
  };
  
  const handleToggleTaskCompletion = async (id: string) => {
    try {
      await toggleTaskCompletion(id);
      fetchTasks();
    } catch (err) {
      console.error('Error toggling task completion:', err);
      setError('Failed to update task. Please try again.');
    }
  };
  
  const handleDeleteTask = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await deleteTask(id);
      fetchTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task. Please try again.');
    }
  };
  
  const handleShareTask = async (data: { userEmail: string }) => {
    if (!taskToShare) return;
    
    try {
      await shareTask({
        taskId: taskToShare.id,
        userEmail: data.userEmail
      });
      setTaskToShare(null);
      fetchTasks();
    } catch (err) {
      console.error('Error sharing task:', err);
      setError('Failed to share task. Please try again.');
    }
  };
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Shared To-Do List</h1>
          <div className="flex space-x-2">
            <span className="mr-2 text-gray-700">Welcome, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
        
        <div className="mb-6 flex items-center justify-between">
          <div>
            <label className="mr-2 font-medium">Filter:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
              className="rounded border p-2"
            >
              <option value="all">All Tasks</option>
              <option value="my">My Tasks</option>
              <option value="shared">Shared Tasks</option>
            </select>
          </div>
          
          <button
            onClick={() => setShowCreateForm(true)}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Add Task
          </button>
        </div>
        
        {error && (
          <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="text-center">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="text-center text-gray-500">No tasks found</div>
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onEdit={() => setTaskToEdit(task)}
                onDelete={() => handleDeleteTask(task.id)}
                onToggleCompletion={() => handleToggleTaskCompletion(task.id)}
                onShare={() => setTaskToShare(task)}
                isOwner={task.userId === user?.id}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Create Task Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">Create New Task</h2>
            <TaskForm 
              onSubmit={handleCreateTask} 
              onCancel={() => setShowCreateForm(false)} 
            />
          </div>
        </div>
      )}
      
      {/* Edit Task Modal */}
      {taskToEdit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">Edit Task</h2>
            <TaskForm 
              initialData={{
                title: taskToEdit.title,
                description: taskToEdit.description || ''
              }}
              onSubmit={(data) => handleUpdateTask(taskToEdit.id, data)} 
              onCancel={() => setTaskToEdit(null)} 
            />
          </div>
        </div>
      )}
      
      {/* Share Task Modal */}
      {taskToShare && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">Share Task</h2>
            <p className="mb-4">
              <strong>Task:</strong> {taskToShare.title}
            </p>
            <ShareTaskForm 
              onSubmit={handleShareTask} 
              onCancel={() => setTaskToShare(null)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;