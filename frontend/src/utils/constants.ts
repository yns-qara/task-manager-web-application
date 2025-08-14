/**
 * Application constants and configuration values
 * Centralizes hardcoded values and provides environment variable fallbacks
 */

/**
 * Application configuration constants
 */
export const APP_CONFIG = {
  /**
   * Application name
   */
  NAME: import.meta.env.VITE_APP_TITLE || 'TASK MANAGER',
  
  /**
   * Application version
   */
  VERSION: '1.0.0',
  
  /**
   * Application description
   */
  DESCRIPTION: 'A modern todo application built with React and TypeScript'
} as const;

/**
 * Task validation limits from environment variables
 */
export const TASK_LIMITS = {
  /**
   * Maximum length for task titles
   */
  TITLE_MAX_LENGTH: parseInt(import.meta.env.VITE_MAX_TITLE_LENGTH) || 100,
  
  /**
   * Maximum length for task descriptions
   */
  DESCRIPTION_MAX_LENGTH: parseInt(import.meta.env.VITE_MAX_DESCRIPTION_LENGTH) || 200
} as const;

/**
 * API configuration constants
 */
export const API_CONFIG = {
  /**
   * Base URL for the API endpoints
   */
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  
  /**
   * Simulated delays for API operations (for UX testing)
   */
  DELAYS: {
    GET_TASKS: 300,
    CREATE_TASK: 200,
    UPDATE_TASK: 200,
    DELETE_TASK: 200
  }
} as const;

/**
 * UI configuration constants
 */
export const UI_CONFIG = {
  /**
   * Number of skeleton placeholders to show when loading
   */
  SKELETON_COUNT: 3,
  
  /**
   * Circumference for progress circle SVG
   */
  PROGRESS_CIRCLE_CIRCUMFERENCE: 283
} as const;

/**
 * React Query configuration constants
 */
export const QUERY_CONFIG = {
  /**
   * Default stale time for queries (5 minutes)
   */
  DEFAULT_STALE_TIME: 5 * 60 * 1000,
  
  /**
   * Default cache time for queries (10 minutes)
   */
  DEFAULT_CACHE_TIME: 10 * 60 * 1000,
  
  /**
   * Number of retry attempts for failed queries
   */
  RETRY_COUNT: 3,
} as const;

/**
 * Query keys for React Query
 */
export const QUERY_KEYS = {
  /**
   * Key for tasks-related queries
   */
  TASKS: ['tasks'] as const,
  
  /**
   * Key for individual task queries
   * @param id - Task ID
   */
  TASK: (id: string) => ['tasks', id] as const,
} as const;