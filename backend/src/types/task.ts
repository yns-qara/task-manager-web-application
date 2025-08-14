import { z } from 'zod';

/**
 * Zod schema for validating complete Task objects
 * Ensures all required fields are present and valid
 */
export const TaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().min(1),
  status: z.enum(['pending', 'done']),
});

/**
 * Zod schema for validating new task creation data
 * ID is not required as it will be auto-generated
 * Status defaults to 'pending' if not provided
 */
export const CreateTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  status: z.enum(['pending', 'done']).default('pending'),
});

/**
 * Zod schema for validating task status updates
 * Only allows updating the status field
 */
export const UpdateTaskSchema = z.object({
  status: z.enum(['pending', 'done']),
});

/**
 * TypeScript type inferred from TaskSchema
 * Represents a complete task object with id, title, description, and status
 */
export type Task = z.infer<typeof TaskSchema>;

/**
 * TypeScript type inferred from CreateTaskSchema
 * Represents the data needed to create a new task (without id)
 */
export type CreateTask = z.infer<typeof CreateTaskSchema>;

/**
 * TypeScript type inferred from UpdateTaskSchema
 * Represents the data needed to update a task's status
 */
export type UpdateTask = z.infer<typeof UpdateTaskSchema>;