/**
 * TaskList component that renders a list of tasks or appropriate fallback states
 * Handles loading states, empty states, and task rendering
 */
import type { Task, UpdateTaskData } from '../../types/task';
import { TaskItem } from './TaskItem';
import { LoadingSkeleton } from '../ui/LoadingSkeleton';

/**
 * Props for the TaskList component
 */
interface TaskListProps {
  /**
   * Array of tasks to display
   */
  tasks: Task[];

  /**
   * Whether tasks are currently being loaded
   */
  loading: boolean;

  /**
   * Callback for toggling task completion status
   */
  onToggleTask: (id: string) => void;

  /**
   * Callback for deleting a task
   */
  onDeleteTask: (id: string) => void;

  /**
   * Callback for updating task data
   */
  onUpdateTask: (id: string, updates: UpdateTaskData) => void | Promise<void>;
}

/**
 * Empty state component shown when there are no tasks
 * Provides visual feedback and guidance to users
 * 
 * @returns JSX element representing the empty state
 */
function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="text-gray-500 mb-4">
        <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <p className="text-gray-500">No tasks yet</p>
      <p className="text-gray-600 text-sm mt-1">Add your first task above to get started</p>
    </div>
  );
}

/**
 * TaskList component for rendering a list of tasks
 * Manages different display states including loading, empty, and populated states
 * 
 * @param props - Component props
 * @returns JSX element representing the task list or appropriate fallback
 */
export function TaskList({
  tasks,
  loading,
  onToggleTask,
  onDeleteTask,
  onUpdateTask
}: TaskListProps) {
  // Show loading skeleton while data is being fetched

  // Dear examinor : uncomment this part to view the loading skeleton...
  // return <LoadingSkeleton count={3} />


  if (loading) {
    return <LoadingSkeleton count={3} />;
  }

  // Show empty state when no tasks exist
  if (tasks.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-3">
      {tasks.slice().reverse().map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={() => onToggleTask(task.id)}
          onDelete={() => onDeleteTask(task.id)}
          onUpdate={(updates) => onUpdateTask(task.id, updates)}
        />
      ))}
    </div>

  );
}