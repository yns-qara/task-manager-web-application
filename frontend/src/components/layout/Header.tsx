import { APP_CONFIG } from '../../utils/constants';

/**
 * Header component that displays the application title
 * Provides consistent branding across the application
 * 
 * @returns JSX element representing the application header
 */
export function Header() {
  return (
    <div className="text-center mb-8">
      <h1 className="text-2xl font-bold text-orange-500 mb-8">
        {APP_CONFIG.NAME}
      </h1>
    </div>
  );
}