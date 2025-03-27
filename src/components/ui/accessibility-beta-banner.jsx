import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './button';

/**
 * Accessibility Beta Banner
 * Displays a banner indicating that accessibility features are in beta
 */
const AccessibilityBetaBanner = () => {
  const [dismissed, setDismissed] = useState(false);

  // Check if the banner has been dismissed in this session
  if (dismissed) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-md z-50 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 p-4 rounded-lg shadow-lg">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-blue-500 dark:text-blue-400" aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-blue-600 dark:text-blue-300">
            Accessibility Features (Beta)
          </h3>
          <div className="mt-1 text-sm text-blue-500 dark:text-blue-400">
            <p>
              The accessibility features in this application are currently in beta. Some features like keyboard shortcuts and focus management may not work perfectly in all scenarios.
            </p>
            <p className="mt-1">
              We're actively improving accessibility. If you encounter issues, please provide feedback.
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="flex-shrink-0 -mt-1 -mr-1 p-1 rounded-md focus:outline-none dark:hover:bg-blue-800/50"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss accessibility beta notice"
        >
          <X className="h-4 w-4 text-blue-500 dark:text-blue-400" />
        </Button>
      </div>
    </div>
  );
};

export default AccessibilityBetaBanner;