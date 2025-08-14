import { Request, Response, NextFunction } from 'express';

/**
 * Global error handling middleware for Express application
 * Catches all unhandled errors and returns a standardized error response
 * @param err - Error object containing error details
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function (required for error middleware signature)
 * @returns JSON error response with 500 status code
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err.stack);
  
  res.status(500).json({
    error: 'Something went wrong!'
  });
};

/**
 * Middleware to handle requests to non-existent routes
 * Returns a 404 error with information about the requested route
 * @param req - Express request object containing the requested URL
 * @param res - Express response object
 * @returns JSON error response with 404 status code and route information
 */
export const notFound = (req: Request, res: Response): void => {
  res.status(404).json({
    error: `Route ${req.originalUrl} not found`
  });
};