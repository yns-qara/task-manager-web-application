/**
 * Task creation form component
 * Provides input fields for creating new tasks with validation and submission handling
 */
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { validateCreateTask } from '../../types/task';
import { TASK_LIMITS } from '../../utils/constants';
import type { CreateTaskData } from '../../types/task';

/**
 * Props for the TaskForm component
 */
interface TaskFormProps {
  /**
   * Callback function called when form is submitted
   */
  onSubmit: (data: CreateTaskData) => void | Promise<void>;
  
  /**
   * Whether the form is currently submitting
   */
  loading?: boolean;
}

/**
 * TaskForm component for creating new tasks
 * Features client-side validation, keyboard shortcuts, and loading states
 * 
 * @param props - Component props
 * @returns JSX element representing the task creation form
 */
export function TaskForm({ onSubmit, loading = false }: TaskFormProps) {
  /**
   * Form state for task title
   */
  const [title, setTitle] = useState('');
  
  /**
   * Form state for task description
   */
  const [description, setDescription] = useState('');
  
  /**
   * Local validation error state
   */
  const [validationError, setValidationError] = useState<string | null>(null);

  /**
   * Handles form submission with validation
   * Validates input data and calls the onSubmit callback
   */
  const handleSubmit = async () => {
    const taskData = {
      title: title.trim(),
      description: description.trim()
    };

    // Client-side validation
    const validation = validateCreateTask(taskData);
    if (!validation.success) {
      setValidationError(validation.error.issues[0]?.message || 'Invalid input');
      return;
    }
    
    try {
      setValidationError(null);
      await onSubmit(validation.data);
      // Clear form on successful submission
      setTitle('');
      setDescription('');
    } catch (error) {
      // Error handling is done by parent component
      console.error('Failed to submit task:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isSubmitDisabled = !title.trim() || loading;

  return (
    <div className="mb-8">
      <div className="flex gap-3 mb-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="write your next task"
          className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
          disabled={loading}
          maxLength={TASK_LIMITS.TITLE_MAX_LENGTH}
        />
        <button
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          className="w-12 h-12 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-full flex items-center justify-center text-white font-bold text-xl transition-colors"
          aria-label="Add task"
        >
          <Plus size={20} />
        </button>
      </div>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="add description (optional)"
        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
        disabled={loading}
        maxLength={TASK_LIMITS.DESCRIPTION_MAX_LENGTH}
      />
      
      {/* Validation Error Display */}
      {validationError && (
        <div className="mt-2 text-sm text-red-400">
          {validationError}
        </div>
      )}
    </div>
  );
}