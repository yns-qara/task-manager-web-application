import { Request, Response } from 'express';
import taskService from '@services/taskService';
import { CreateTaskSchema, UpdateTaskSchema } from '../types/task';
import { z } from 'zod';

/**
 * Retrieves all tasks from the task service
 * @param req - Express request object (no parameters expected)
 * @param res - Express response object
 * @returns JSON array of all tasks or error message
 */
export const getAllTasks = (req: Request, res: Response): void => {
    try {
        const tasks = taskService.getAllTasks();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * Creates a new task with the provided data
 * @param req - Express request object containing task data in body (title, description, status)
 * @param res - Express response object
 * @returns JSON object of the created task with 201 status or error message
 */
export const createTask = (req: Request, res: Response): void => {
    try {
        const taskData = CreateTaskSchema.parse(req.body);
        const newTask = taskService.createTask(taskData);
        res.status(201).json(newTask);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: 'Invalid data', details: error.issues });
        } else {
            res.status(500).json({ error: 'Server error' });
        }
    }
};

/**
 * Deletes a task by its ID
 * @param req - Express request object containing task ID in params
 * @param res - Express response object
 * @returns JSON confirmation message or error message
 */
export const deleteTask = (req: Request, res: Response): void => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ error: 'Task ID is required' });
            return;
        }

        const deleted = taskService.deleteTask(id);

        if (!deleted) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }

        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * Updates only the status of a specific task
 * @param req - Express request object containing task ID in params and status in body
 * @param res - Express response object
 * @returns JSON object of the updated task or error message
 */
export const updateTaskStatus = (req: Request, res: Response): void => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ error: 'Task ID is required' });
            return;
        }

        const updateData = UpdateTaskSchema.parse(req.body);
        const updatedTask = taskService.updateTaskStatus(id, updateData);

        if (!updatedTask) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }

        res.json(updatedTask);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: 'Invalid data', details: error.issues });
        } else {
            res.status(500).json({ error: 'Server error' });
        }
    }
};

/**
 * Updates all fields of a specific task (title, description, status)
 * @param req - Express request object containing task ID in params and task data in body
 * @param res - Express response object
 * @returns JSON object of the updated task or error message
 */
export const updateTask = (req: Request, res: Response): void => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ error: 'Task ID is required' });
            return;
        }

        const updateData = CreateTaskSchema.parse(req.body);
        const updatedTask = taskService.updateTask(id, updateData);

        if (!updatedTask) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }

        res.json(updatedTask);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: 'Invalid data', details: error.issues });
        } else {
            res.status(500).json({ error: 'Server error' });
        }
    }
};