/**
 * Progress indicator component that displays task completion status
 * Shows progress as both a visual circle and numeric representation
 */
import { UI_CONFIG } from '../../utils/constants';

/**
 * Props for the ProgressIndicator component
 */
interface ProgressIndicatorProps {
  /**
   * Number of completed tasks
   */
  completed: number;
  
  /**
   * Total number of tasks
   */
  total: number;
}

/**
 * ProgressIndicator component that displays completion progress
 * Features a circular progress bar with percentage calculation
 * 
 * @param props - Component props
 * @returns JSX element representing the progress indicator
 */
export function ProgressIndicator({ completed, total }: ProgressIndicatorProps) {
  /**
   * Calculate completion percentage, ensuring no division by zero
   */
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  /**
   * Calculate stroke dash array value for the progress circle
   */
  const strokeDashArray = `${percentage * (UI_CONFIG.PROGRESS_CIRCLE_CIRCUMFERENCE / 100)} ${UI_CONFIG.PROGRESS_CIRCLE_CIRCUMFERENCE}`;

  return (
    <div className="text-center mb-8">
      <div className="relative inline-flex items-center justify-center w-24 h-24 mb-4">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="6"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#FF6B47"
            strokeWidth="6"
            strokeDasharray={strokeDashArray}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-semibold text-sm">{completed}/{total}</span>
        </div>
      </div>
      <h1 className="text-2xl font-bold text-white mb-1">Todo Done</h1>
      <p className="text-gray-400 text-sm">keep it up</p>
    </div>
  );
}