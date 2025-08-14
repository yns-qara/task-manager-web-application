/**
 * TaskItem component representing a single task in the task list
 * Provides inline editing, status toggling, and deletion functionality
 */
import React, { useState, useCallback } from 'react';
import { Check, Edit2, Trash2 } from 'lucide-react';
import { validateUpdateTask } from '../../types/task';
import { TASK_LIMITS } from '../../utils/constants';
import type { Task, UpdateTaskData } from '../../types/task';

/**
 * Props for the TaskItem component
 */
interface TaskItemProps {
  /**
   * The task data to display and interact with
   */
  task: Task;
  
  /**
   * Callback for toggling task completion status
   */
  onToggle: () => void;
  
  /**
   * Callback for deleting the task
   */
  onDelete: () => void;
  
  /**
   * Callback for updating task data
   */
  onUpdate: (updates: UpdateTaskData) => void | Promise<void>;
}

/**
 * TaskItem component for displaying and interacting with individual tasks
 * Features inline editing with validation, status toggling, and deletion
 * 
 * @param props - Component props
 * @returns JSX element representing a task item
 */
export function TaskItem({ task, onToggle, onDelete, onUpdate }: TaskItemProps) {
  /**
   * Whether the task is currently in edit mode
   */
  const [isEditing, setIsEditing] = useState(false);
  
  /**
   * Local state for editing task title
   */
  const [editTitle, setEditTitle] = useState(task.title);
  
  /**
   * Local state for editing task description
   */
  const [editDescription, setEditDescription] = useState(task.description);
  
  /**
   * Whether an update operation is in progress
   */
  const [isUpdating, setIsUpdating] = useState(false);
  
  /**
   * Local validation error state
   */
  const [validationError, setValidationError] = useState<string | null>(null);

  /**
   * Handles saving task updates with validation
   * Validates input data before calling the update callback
   */
  const handleSave = useCallback(async () => {
    const updates = {
      title: editTitle.trim(),
      description: editDescription.trim()
    };

    // Client-side validation
    const validation = validateUpdateTask(updates);
    if (!validation.success) {
      setValidationError(validation.error.issues[0]?.message || 'Invalid input');
      return;
    }

    try {
      setIsUpdating(true);
      setValidationError(null);
      await onUpdate(validation.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update task:', error);
    } finally {
      setIsUpdating(false);
    }
  }, [editTitle, editDescription, onUpdate]);

  /**
   * Handles canceling edit mode and resetting form state
   */
  const handleCancel = useCallback(() => {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setValidationError(null);
    setIsEditing(false);
  }, [task.title, task.description]);

  /**
   * Handles keyboard shortcuts in edit mode
   * Enter saves changes, Escape cancels editing
   * @param e - Keyboard event
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-3">
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-orange-500"
            placeholder="Task title"
            maxLength={TASK_LIMITS.TITLE_MAX_LENGTH}
            autoFocus
            disabled={isUpdating}
          />
          <input
            type="text"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Description"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
            maxLength={TASK_LIMITS.DESCRIPTION_MAX_LENGTH}
            disabled={isUpdating}
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={handleCancel}
              disabled={isUpdating}
              className="px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isUpdating || !editTitle.trim()}
              className="px-3 py-1 text-sm bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded transition-colors"
            >
              {isUpdating ? 'Saving...' : 'Save'}
            </button>
          </div>
          
          {/* Validation Error Display */}
          {validationError && (
            <div className="mt-2 text-sm text-red-400">
              {validationError}
            </div>
          )}
        </div>
      </div>
    );
  }

  /**
   * Determine if the task is completed
   */
  const isDone = task.status === 'done';

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-3 flex items-center gap-4 hover:border-gray-600 transition-colors">
      <button
        onClick={onToggle}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
          isDone
            ? 'bg-green-500 border-green-500'
            : 'border-red-500 hover:border-red-400'
        }`}
        aria-label={isDone ? 'Mark as pending' : 'Mark as done'}
      >
        {isDone && <Check size={14} className="text-white" />}
      </button>
      
      <div className="flex-1 min-w-0">
        <h3 className={`font-medium truncate ${isDone ? 'text-gray-500 line-through' : 'text-white'}`}>
          {task.title}
        </h3>
        {task.description && (
          <p className={`text-sm mt-1 break-words ${isDone ? 'text-gray-600' : 'text-gray-400'}`}>
            {task.description}
          </p>
        )}
      </div>
      
      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={() => setIsEditing(true)}
          className="p-2 text-gray-500 hover:text-orange-400 transition-colors"
          aria-label="Edit task"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={onDelete}
          className="p-2 text-gray-500 hover:text-red-400 transition-colors"
          aria-label="Delete task"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}