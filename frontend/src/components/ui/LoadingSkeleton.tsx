/**
 * Props for the LoadingSkeleton component
 */
interface LoadingSkeletonProps {
  /**
   * Number of skeleton items to display
   */
  count?: number;
}

/**
 * LoadingSkeleton component that displays animated placeholder items
 * Used while content is loading to improve perceived performance
 * 
 * @param props - Component props
 * @returns JSX element representing loading skeleton placeholders
 */
export function LoadingSkeleton({ count = 3 }: LoadingSkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-4 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 bg-gray-700 rounded-full flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <div className="w-8 h-8 bg-gray-700 rounded"></div>
              <div className="w-8 h-8 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}