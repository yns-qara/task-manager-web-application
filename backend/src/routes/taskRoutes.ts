import { Router } from 'express';
import {
  getAllTasks,
  createTask,
  deleteTask,
  updateTaskStatus,
  updateTask
} from '@controllers/taskController';

/**
 * Express router instance for handling task-related HTTP routes
 */
const router = Router();

/**
 * GET /tasks - Retrieve all tasks
 */
router.get('/tasks', getAllTasks);

/**
 * POST /tasks - Create a new task
 * Request body should contain: { title: string, description: string, status?: 'pending' | 'done' }
 */
router.post('/tasks', createTask);

/**
 * DELETE /tasks/:id - Delete a specific task by ID
 * URL parameter: id (string) - The unique identifier of the task to delete
 */
router.delete('/tasks/:id', deleteTask);

/**
 * PATCH /tasks/:id - Update only the status of a specific task
 * URL parameter: id (string) - The unique identifier of the task to update
 * Request body should contain: { status: 'pending' | 'done' }
 */
router.patch('/tasks/:id', updateTaskStatus);

/**
 * PUT /tasks/:id - Update all fields of a specific task
 * URL parameter: id (string) - The unique identifier of the task to update
 * Request body should contain: { title: string, description: string, status: 'pending' | 'done' }
 */
router.put('/tasks/:id', updateTask);

export default router;