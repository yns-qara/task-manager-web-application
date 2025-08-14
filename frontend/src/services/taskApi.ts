/**
 * Task API service for handling HTTP requests to the backend
 * Provides methods for all CRUD operations on tasks with proper error handling
 */
import { validateTask } from '../types/task';
import type { Task, TaskStatus, CreateTaskData, UpdateTaskData } from '../types/task';
import { API_CONFIG } from '../utils/constants';

/**
 * Custom error class for API-related errors
 */
export class APIError extends Error {
  /**
   * HTTP status code of the error response
   */
  public status: number;
  
  /**
   * Additional error details from the server
   */
  public details?: any;

  constructor(message: string, status: number, details?: any) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.details = details;
  }
}

/**
 * Task API service class that handles all task-related HTTP operations
 */
export class TaskAPI {
  /**
   * Base URL for all API endpoints
   */
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  /**
   * Makes HTTP requests with proper error handling and response validation
   * @param url - The endpoint URL
   * @param options - Fetch options
   * @returns Promise resolving to the response data
   * @throws APIError when the request fails
   */
  private async makeRequest<T>(url: string, options?: RequestInit): Promise<T> {
    const fullUrl = `${this.baseUrl}${url}`;
    
    try {
      const response = await fetch(fullUrl, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });


      if (!response.ok) {
        let errorDetails;
        try {
          errorDetails = await response.json();
        } catch {
          // If response doesn't contain JSON, ignore
        }
        
        const errorMessage = errorDetails?.error || `HTTP ${response.status}: ${response.statusText}`;
        console.error('❌ API Error:', errorMessage);
        
        throw new APIError(
          errorMessage,
          response.status,
          errorDetails
        );
      }

      // Handle responses with no content (like DELETE)
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return undefined as T;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ Network/API error:', error);
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError('Network error occurred', 0, error);
    }
  }

  /**
   * Validates and processes task data received from the API
   * @param data - Raw task data from API
   * @returns Validated Task object
   * @throws Error if validation fails
   */
  private validateTaskData(data: unknown): Task {
    const result = validateTask(data);
    if (!result.success) {
      throw new Error(`Invalid task data: ${result.error.message}`);
    }
    return result.data;
  }

  /**
   * Retrieves all tasks from the server
   * @returns Promise resolving to array of Task objects
   * @throws APIError when the request fails
   */
  getTasks = async (): Promise<Task[]> => {
    const data = await this.makeRequest<unknown[]>('/tasks');
    return data.map(task => this.validateTaskData(task));
  }

  /**
   * Creates a new task on the server
   * @param taskData - Data for the new task (title, description)
   * @returns Promise resolving to the created Task object
   * @throws APIError when the request fails
   */
  createTask = async (taskData: CreateTaskData): Promise<Task> => {
    const data = await this.makeRequest<unknown>('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
    
    return this.validateTaskData(data);
  }

  /**
   * Updates only the status of a specific task
   * @param id - The unique identifier of the task
   * @param status - The new status value ('pending' or 'done')
   * @returns Promise resolving to the updated Task object
   * @throws APIError when the request fails
   */
  updateTaskStatus = async (id: string, status: TaskStatus): Promise<Task> => {
    const data = await this.makeRequest<unknown>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    
    return this.validateTaskData(data);
  }

  /**
   * Updates all fields of a specific task
   * @param id - The unique identifier of the task
   * @param updates - Object containing fields to update
   * @returns Promise resolving to the updated Task object
   * @throws APIError when the request fails
   */
  updateTask = async (id: string, updates: UpdateTaskData): Promise<Task> => {
    const data = await this.makeRequest<unknown>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    
    return this.validateTaskData(data);
  }

  /**
   * Deletes a task from the server
   * @param id - The unique identifier of the task to delete
   * @returns Promise that resolves when deletion is complete
   * @throws APIError when the request fails
   */
  deleteTask = async (id: string): Promise<void> => {
    await this.makeRequest<void>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Retrieves a single task by its ID
   * @param id - The unique identifier of the task
   * @returns Promise resolving to the Task object
   * @throws APIError when the request fails
   */
  getTask = async (id: string): Promise<Task> => {
    const data = await this.makeRequest<unknown>(`/tasks/${id}`);
    return this.validateTaskData(data);
  }
}

/**
 * Singleton instance of TaskAPI for use throughout the application
 */
export const taskApi = new TaskAPI();