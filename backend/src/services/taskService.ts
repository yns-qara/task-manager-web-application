import { Task, CreateTask, UpdateTask } from '../types/task';

/**
 * Service class that manages task operations and data storage
 * Uses in-memory storage with a sample task for demonstration
 */
class TaskService {
    /**
     * In-memory storage for tasks with a sample task
     */
    private tasks: Task[] = [
        { id: '1', title: 'Sample Task', description: 'This is a sample task', status: 'pending' }
    ];

    /**
     * Counter to generate unique IDs for new tasks
     */
    private nextId = 2;

    /**
     * Retrieves all tasks from memory
     * @returns Array of all Task objects
     */
    getAllTasks(): Task[] {
        return this.tasks;
    }

    /**
     * Finds a specific task by its ID
     * @param id - The unique identifier of the task to find
     * @returns Task object if found, undefined otherwise
     */
    getTaskById(id: string): Task | undefined {
        return this.tasks.find(task => task.id === id);
    }

    /**
     * Creates a new task and adds it to the tasks array
     * @param taskData - Object containing title, description, and status for the new task
     * @returns The newly created Task object with generated ID
     */
    createTask(taskData: CreateTask): Task {
        const newTask: Task = {
            id: this.nextId.toString(),
            ...taskData,
        };
        this.nextId++;
        this.tasks.push(newTask);
        return newTask;
    }

    /**
     * Removes a task from the tasks array by ID
     * @param id - The unique identifier of the task to delete
     * @returns true if task was found and deleted, false if task was not found
     */
    deleteTask(id: string): boolean {
        const taskIndex = this.tasks.findIndex(task => task.id === id);

        if (taskIndex === -1) {
            return false;
        }

        this.tasks.splice(taskIndex, 1);
        return true;
    }

    /**
     * Updates only the status of a specific task
     * @param id - The unique identifier of the task to update
     * @param updateData - Object containing the new status value
     * @returns Updated Task object if found, null if task was not found
     */
    updateTaskStatus(id: string, updateData: UpdateTask): Task | null {
        const taskIndex = this.tasks.findIndex(task => task.id === id);

        if (taskIndex === -1) {
            return null;
        }

        this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updateData };
        return this.tasks[taskIndex];
    }

    /**
     * Updates all fields (title, description, status) of a specific task
     * @param id - The unique identifier of the task to update
     * @param updateData - Object containing title, description, and status values
     * @returns Updated Task object if found, null if task was not found
     */
    updateTask(id: string, updateData: CreateTask): Task | null {
        const taskIndex = this.tasks.findIndex(task => task.id === id);

        if (taskIndex === -1) {
            return null;
        }

        this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updateData };
        return this.tasks[taskIndex];
    }
}

/**
 * Export a singleton instance of TaskService for use throughout the application
 */
export default new TaskService();