import { Linkedin } from "lucide-react";

/**
 * Footer component that displays attribution information
 * Provides consistent footer content across the application
 * 
 * @returns JSX element representing the application footer
 */
export function Footer() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-center py-3 text-gray-400 text-xs border-t border-gray-800">
      <div className="flex items-center justify-center gap-2">
        <a
          href="https://www.linkedin.com/in/younes-qara-3457ab205"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-gray-400 hover:text-blue-400 transition-colors"
        >
          <Linkedin size={14} />
        </a>
        <p>Younes Qara</p>
      </div>
    </div>
  );
}