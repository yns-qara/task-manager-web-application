/**
 * Express.js server configuration and startup
 * 
 * This server provides a RESTful API for task management with the following features:
 * - CORS support for cross-origin requests
 * - JSON request/response parsing
 * - Swagger/OpenAPI documentation at /api-docs
 * - Task management endpoints under /api
 * - Health check endpoint at /health
 * - Global error handling for 404 and 500 errors
 * - Configurable host and port via environment variables
 */
import express from 'express';
import cors from 'cors';
import taskRoutes from '@routes/taskRoutes';
import { errorHandler, notFound } from '@middleware/errorHandler';
import { specs, swaggerUi } from '@config/swagger';

/**
 * Initialize Express application instance
 */
const app = express();

/**
 * Server configuration from environment variables with fallback defaults
 */
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';


/**
 * Enable Cross-Origin Resource Sharing (CORS) for all routes
 * Allows frontend applications from different domains to access the API
 */
app.use(cors());

/**
 * Parse incoming JSON requests and make the data available in req.body
 */
app.use(express.json());

/**
 * Serve Swagger UI documentation at /api-docs endpoint
 * Provides interactive API documentation and testing interface
 */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

/**
 * Mount task-related routes under /api prefix
 * All task endpoints will be available at /api/tasks
 */
app.use('/api', taskRoutes);

/**
 * Health check endpoint to verify server status
 * Returns a simple JSON response indicating the server is operational
 * @param req - Express request object (no parameters expected)
 * @param res - Express response object
 * @returns JSON object with success message
 */
app.get('/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

/**
 * Handle requests to undefined routes (404 errors)
 * Must be placed after all valid route definitions
 */
app.use(notFound);

/**
 * Global error handling middleware
 * Catches any unhandled errors and returns standardized error responses
 * Must be the last middleware in the chain
 */
app.use(errorHandler);

/**
 * Start the Express server and listen for incoming requests
 * Logs server startup information including URL and documentation link
 */
app.listen(PORT, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
  console.log(`Swagger docs available at http://${HOST}:${PORT}/api-docs`);
});