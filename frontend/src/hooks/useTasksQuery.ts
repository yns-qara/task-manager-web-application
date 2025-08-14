/**
 * React Query hooks for task management
 * Provides caching, synchronization, and optimistic updates for task operations
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { taskApi, APIError } from '../services/taskApi';
import type { Task, CreateTaskData, UpdateTaskData, TaskStatus } from '../types/task';
import { QUERY_KEYS, QUERY_CONFIG } from '../utils/constants';

/**
 * Hook for fetching all tasks with caching and automatic refetching
 * @returns Query object with tasks data, loading state, and error information
 */
export function useTasksQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.TASKS,
    queryFn: async () => {
      console.log('Fetching tasks...');
      try {
        const result = await taskApi.getTasks();
        console.log('Tasks fetched successfully:', result.length, 'tasks');
        return result;
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
        throw error;
      }
    },
    staleTime: 0, // Always fetch fresh data for debugging
    gcTime: QUERY_CONFIG.DEFAULT_CACHE_TIME,
    retry: 1, // Reduce retries for faster debugging
    retryDelay: 500, // Faster retry delay for debugging
  });
}

/**
 * Hook for fetching a single task by ID
 * @param id - Task ID to fetch
 * @returns Query object with task data, loading state, and error information
 */
export function useTaskQuery(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.TASK(id),
    queryFn: () => taskApi.getTask(id),
    staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME,
    gcTime: QUERY_CONFIG.DEFAULT_CACHE_TIME,
    retry: QUERY_CONFIG.RETRY_COUNT,
    enabled: !!id,
  });
}

/**
 * Hook for creating new tasks with optimistic updates
 * @returns Mutation object with mutate function and state information
 */
export function useCreateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskData: CreateTaskData) => taskApi.createTask(taskData),
    onSuccess: (newTask: Task) => {
      // Update the tasks cache with the new task
      queryClient.setQueryData<Task[]>(QUERY_KEYS.TASKS, (oldTasks = []) => [
        ...oldTasks,
        newTask,
      ]);
      
      // Invalidate and refetch tasks to ensure consistency
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS });
    },
    onError: (error: APIError) => {
      console.error('Failed to create task:', error);
      // React Query will automatically handle error states
    },
  });
}

/**
 * Hook for updating task status with optimistic updates
 * @returns Mutation object with mutate function and state information
 */
export function useUpdateTaskStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) => 
      taskApi.updateTaskStatus(id, status),
    onMutate: async ({ id, status }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.TASKS });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData<Task[]>(QUERY_KEYS.TASKS);

      // Optimistically update to the new value
      if (previousTasks) {
        queryClient.setQueryData<Task[]>(QUERY_KEYS.TASKS, (oldTasks = []) =>
          oldTasks.map(task => 
            task.id === id ? { ...task, status } : task
          )
        );
      }

      // Return a context object with the snapshotted value
      return { previousTasks };
    },
    onError: (error: APIError, _variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousTasks) {
        queryClient.setQueryData<Task[]>(QUERY_KEYS.TASKS, context.previousTasks);
      }
      console.error('Failed to update task status:', error);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS });
    },
  });
}

/**
 * Hook for updating entire tasks with optimistic updates
 * @returns Mutation object with mutate function and state information
 */
export function useUpdateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateTaskData }) => 
      taskApi.updateTask(id, updates),
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.TASKS });
      
      const previousTasks = queryClient.getQueryData<Task[]>(QUERY_KEYS.TASKS);

      if (previousTasks) {
        queryClient.setQueryData<Task[]>(QUERY_KEYS.TASKS, (oldTasks = []) =>
          oldTasks.map(task => 
            task.id === id ? { ...task, ...updates } : task
          )
        );
      }

      return { previousTasks };
    },
    onError: (error: APIError, _variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData<Task[]>(QUERY_KEYS.TASKS, context.previousTasks);
      }
      console.error('Failed to update task:', error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS });
    },
  });
}

/**
 * Hook for deleting tasks with optimistic updates
 * @returns Mutation object with mutate function and state information
 */
export function useDeleteTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => taskApi.deleteTask(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.TASKS });
      
      const previousTasks = queryClient.getQueryData<Task[]>(QUERY_KEYS.TASKS);

      if (previousTasks) {
        queryClient.setQueryData<Task[]>(QUERY_KEYS.TASKS, (oldTasks = []) =>
          oldTasks.filter(task => task.id !== id)
        );
      }

      return { previousTasks };
    },
    onError: (error: APIError, _variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData<Task[]>(QUERY_KEYS.TASKS, context.previousTasks);
      }
      console.error('Failed to delete task:', error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS });
    },
  });
}

/**
 * Combined hook that provides all task operations with a unified interface
 * Similar to the original useTasks hook but powered by React Query
 * @returns Object with tasks data, loading states, and mutation functions
 */
export function useTasks() {
  const tasksQuery = useTasksQuery();
  const createTaskMutation = useCreateTaskMutation();
  const updateTaskStatusMutation = useUpdateTaskStatusMutation();
  const updateTaskMutation = useUpdateTaskMutation();
  const deleteTaskMutation = useDeleteTaskMutation();

  /**
   * Creates a new task
   * @param taskData - Data for the new task
   * @returns Promise that resolves to the created task
   */
  const createTask = async (taskData: CreateTaskData): Promise<Task> => {
    return createTaskMutation.mutateAsync(taskData);
  };

  /**
   * Toggles the status of a task between 'pending' and 'done'
   * @param id - ID of the task to toggle
   * @returns Promise that resolves when the update is complete
   */
  const toggleTaskStatus = async (id: string): Promise<void> => {
    const currentTasks = tasksQuery.data || [];
    const task = currentTasks.find(t => t.id === id);
    
    if (!task) {
      throw new Error('Task not found');
    }

    const newStatus: TaskStatus = task.status === 'done' ? 'pending' : 'done';
    await updateTaskStatusMutation.mutateAsync({ id, status: newStatus });
  };

  /**
   * Updates a task with new data
   * @param id - ID of the task to update
   * @param updates - Data to update
   * @returns Promise that resolves to the updated task
   */
  const updateTask = async (id: string, updates: UpdateTaskData): Promise<Task> => {
    return updateTaskMutation.mutateAsync({ id, updates });
  };

  /**
   * Deletes a task
   * @param id - ID of the task to delete
   * @returns Promise that resolves when the deletion is complete
   */
  const deleteTask = async (id: string): Promise<void> => {
    await deleteTaskMutation.mutateAsync(id);
  };

  /**
   * Manually refetches tasks from the server
   * @returns Promise that resolves when the refetch is complete
   */
  const refetch = async (): Promise<void> => {
    await tasksQuery.refetch();
  };

  return {
    // Data
    tasks: tasksQuery.data || [],
    
    // Loading states
    loading: tasksQuery.isPending,
    isCreating: createTaskMutation.isPending,
    isUpdating: updateTaskStatusMutation.isPending || updateTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,
    
    // Error states
    error: tasksQuery.error?.message || 
           createTaskMutation.error?.message || 
           updateTaskStatusMutation.error?.message || 
           updateTaskMutation.error?.message || 
           deleteTaskMutation.error?.message || 
           null,
    
    // Actions
    createTask,
    toggleTaskStatus,
    updateTask,
    deleteTask,
    refetch,
    
    // Query state helpers
    isStale: tasksQuery.isStale,
    isFetching: tasksQuery.isFetching,
  };
}