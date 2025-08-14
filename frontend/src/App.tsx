/**
 * Main App component that serves as the root of the task management application
 * Handles task operations and provides a cohesive user interface
 */
import { useState, useCallback } from 'react';
import { useTasks } from './hooks/useTasksQuery';
import { validateCreateTask } from './types/task';
import type { CreateTaskData, UpdateTaskData } from './types/task';

// Layout Components
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

// UI Components
import { ProgressIndicator } from './components/ui/ProgressIndicator';
import { ErrorDisplay } from './components/ui/ErrorDisplay';

// Form Components
import { TaskForm } from './components/forms/TaskForm';

// Task Components
import { TaskList } from './components/tasks/TaskList';

/**
 * Main App component
 * Manages the overall application state and coordinates between different components
 * 
 * @returns JSX element representing the complete task management application
 */
function App() {
  const { 
    tasks, 
    loading, 
    error, 
    isCreating,
    createTask, 
    toggleTaskStatus, 
    deleteTask, 
    updateTask 
  } = useTasks();
  
  /**
   * Local state for form submission to prevent double submissions
   */
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Calculate the number of completed tasks for progress indicator
   */
  const completedTasks = tasks.filter(task => task.status === 'done').length;

  /**
   * Handles task creation with client-side validation and error handling
   * @param taskData - The task data from the form
   */
  const handleCreateTask = useCallback(async (taskData: CreateTaskData) => {
    // Validate data before sending to server
    const validation = validateCreateTask(taskData);
    if (!validation.success) {
      console.error('Validation failed:', validation.error);
      return;
    }

    try {
      setIsSubmitting(true);
      await createTask(validation.data);
    } catch (err) {
      // Error is already handled by React Query
      console.error('Failed to create task:', err);
    } finally {
      setIsSubmitting(false);
    }
  }, [createTask]);

  /**
   * Handles toggling task status between pending and done
   * @param id - The unique identifier of the task to toggle
   */
  const handleToggleTask = useCallback((id: string) => {
    toggleTaskStatus(id).catch(err => {
      console.error('Failed to toggle task status:', err);
    });
  }, [toggleTaskStatus]);

  /**
   * Handles task deletion with error handling
   * @param id - The unique identifier of the task to delete
   */
  const handleDeleteTask = useCallback((id: string) => {
    deleteTask(id).catch(err => {
      console.error('Failed to delete task:', err);
    });
  }, [deleteTask]);

  /**
   * Handles task updates with validation and error handling
   * @param id - The unique identifier of the task to update
   * @param updates - The partial task data to update
   */
  const handleUpdateTask = useCallback(async (id: string, updates: UpdateTaskData) => {
    try {
      await updateTask(id, updates);
    } catch (err) {
      // Error is already handled by React Query
      console.error('Failed to update task:', err);
    }
  }, [updateTask]);

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <Header />

        {/* Progress Indicator */}
        <ProgressIndicator completed={completedTasks} total={tasks.length} />

        {/* Task Form */}
        <TaskForm onSubmit={handleCreateTask} loading={isSubmitting || isCreating} />

        {/* Error Display */}
        {error && <ErrorDisplay error={error} />}

        {/* Task List */}
        <TaskList
          tasks={tasks}
          loading={loading}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
          onUpdateTask={handleUpdateTask}
        />

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

export default App;