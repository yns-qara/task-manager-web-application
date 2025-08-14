/**
 * Props for the ErrorDisplay component
 */
interface ErrorDisplayProps {
  /**
   * The error message to display
   */
  error: string;
  
  /**
   * Optional callback for dismissing the error
   */
  onDismiss?: () => void;
}

/**
 * ErrorDisplay component for showing error messages to users
 * Provides a consistent error UI with optional dismissal functionality
 * 
 * @param props - Component props
 * @returns JSX element representing the error display
 */
export function ErrorDisplay({ error, onDismiss }: ErrorDisplayProps) {
  return (
    <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-4 text-red-200 text-sm">
      <div className="flex justify-between items-start">
        <span>{error}</span>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-2 text-red-300 hover:text-red-100 transition-colors"
            aria-label="Dismiss error"
          >
            x
          </button>
        )}
      </div>
    </div>
  );
}