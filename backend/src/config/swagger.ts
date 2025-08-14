import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

/**
 * Swagger/OpenAPI configuration options
 * Defines the API documentation structure, schemas, and endpoints
 */
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Todo API',
      version: '1.0.0',
      description: 'A simple Todo API built with Express and TypeScript',
    },
    servers: [
      {
        url: process.env.API_BASE_URL || 'http://localhost:3000/api',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Task: {
          type: 'object',
          required: ['id', 'title', 'description', 'status'],
          properties: {
            id: {
              type: 'string',
              description: 'The unique identifier for the task',
            },
            title: {
              type: 'string',
              description: 'The title of the task',
            },
            description: {
              type: 'string',
              description: 'The description of the task',
            },
            status: {
              type: 'string',
              enum: ['pending', 'done'],
              description: 'The status of the task',
            },
          },
        },
        CreateTask: {
          type: 'object',
          required: ['title', 'description'],
          properties: {
            title: {
              type: 'string',
              description: 'The title of the task',
            },
            description: {
              type: 'string',
              description: 'The description of the task',
            },
            status: {
              type: 'string',
              enum: ['pending', 'done'],
              description: 'The status of the task',
              default: 'pending',
            },
          },
        },
        UpdateTaskStatus: {
          type: 'object',
          required: ['status'],
          properties: {
            status: {
              type: 'string',
              enum: ['pending', 'done'],
              description: 'The new status of the task',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
            },
            details: {
              type: 'array',
              items: {
                type: 'object',
              },
              description: 'Additional error details',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

/**
 * Generate Swagger specification from the configuration options
 * This creates the complete API documentation object
 */
export const specs = swaggerJsdoc(options);

/**
 * Export swagger-ui-express for serving the documentation interface
 */
export { swaggerUi };