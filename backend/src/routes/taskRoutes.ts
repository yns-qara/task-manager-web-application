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
 * @swagger
 * /tasks:
 *   get:
 *     summary: Retrieve all tasks
 *     description: Get a list of all tasks in the system
 *     tags:
 *       - Tasks
 *     responses:
 *       200:
 *         description: Successfully retrieved all tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *             example:
 *               - id: "1"
 *                 title: "Complete project documentation"
 *                 description: "Write comprehensive documentation for the task management API"
 *                 status: "pending"
 *               - id: "2"
 *                 title: "Review code changes"
 *                 description: "Review pull request #123 for the new authentication feature"
 *                 status: "done"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/tasks', getAllTasks);

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     description: Add a new task to the task list
 *     tags:
 *       - Tasks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTask'
 *           example:
 *             title: "Implement user authentication"
 *             description: "Add JWT-based authentication to the application"
 *             status: "pending"
 *     responses:
 *       201:
 *         description: Task successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *             example:
 *               id: "3"
 *               title: "Implement user authentication"
 *               description: "Add JWT-based authentication to the application"
 *               status: "pending"
 *       400:
 *         description: Bad request - Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Validation failed"
 *               details:
 *                 - field: "title"
 *                   message: "Title is required"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/tasks', createTask);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a specific task
 *     description: Remove a task from the task list by its unique identifier
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the task to delete
 *         example: "1"
 *     responses:
 *       200:
 *         description: Task successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Task deleted successfully"
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Task not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/tasks/:id', deleteTask);

/**
 * @swagger
 * /tasks/{id}:
 *   patch:
 *     summary: Update task status
 *     description: Update only the status of a specific task (pending or done)
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the task to update
 *         example: "1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTaskStatus'
 *           example:
 *             status: "done"
 *     responses:
 *       200:
 *         description: Task status successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *             example:
 *               id: "1"
 *               title: "Complete project documentation"
 *               description: "Write comprehensive documentation for the task management API"
 *               status: "done"
 *       400:
 *         description: Bad request - Invalid status value
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Validation failed"
 *               details:
 *                 - field: "status"
 *                   message: "Status must be either 'pending' or 'done'"
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Task not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch('/tasks/:id', updateTaskStatus);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update entire task
 *     description: Update all fields of a specific task (title, description, and status)
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the task to update
 *         example: "1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *           example:
 *             title: "Complete comprehensive project documentation"
 *             description: "Write detailed documentation for the task management API including examples and usage guides"
 *             status: "pending"
 *     responses:
 *       200:
 *         description: Task successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *             example:
 *               id: "1"
 *               title: "Complete comprehensive project documentation"
 *               description: "Write detailed documentation for the task management API including examples and usage guides"
 *               status: "pending"
 *       400:
 *         description: Bad request - Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Validation failed"
 *               details:
 *                 - field: "title"
 *                   message: "Title is required"
 *                 - field: "status"
 *                   message: "Status must be either 'pending' or 'done'"
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Task not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/tasks/:id', updateTask);

export default router;