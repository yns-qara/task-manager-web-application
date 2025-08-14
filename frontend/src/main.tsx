/**
 * Application entry point
 * Sets up the React root with providers and renders the main App component
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryProvider } from './providers/QueryProvider'

/**
 * Initialize and render the React application
 * Wraps the App with necessary providers for state management and caching
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <App />
    </QueryProvider>
  </StrictMode>,
)
