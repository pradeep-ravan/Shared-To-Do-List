import React from 'react';
import type  { Task } from '../services/tasks';

interface TaskItemProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onToggleCompletion: () => void;
  onShare: () => void;
  isOwner: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onEdit,
  onDelete,
  onToggleCompletion,
  onShare,
  isOwner
}) => {
  return (
    <div className={`rounded-lg border p-4 ${task.completed ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={onToggleCompletion}
            className="mt-1 h-5 w-5 cursor-pointer"
          />
          <div>
            <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className={`mt-1 ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                {task.description}
              </p>
            )}
            <div className="mt-2 text-sm text-gray-500">
              {isOwner ? (
                <span>You created this task</span>
              ) : (
                <span>Created by: {task.user.name}</span>
              )}
              {task.sharedWith.length > 0 && (
                <div className="mt-1">
                  <span>Shared with: </span>
                  {task.sharedWith.map((user) => user.name).join(', ')}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800 hover:bg-blue-200"
          >
            Edit
          </button>
          {isOwner && (
            <>
              <button
                onClick={onShare}
                className="rounded bg-green-100 px-2 py-1 text-xs text-green-800 hover:bg-green-200"
              >
                Share
              </button>
              <button
                onClick={onDelete}
                className="rounded bg-red-100 px-2 py-1 text-xs text-red-800 hover:bg-red-200"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;