import React from 'react';
import { SafeDisplayProps } from '@/types/object-rendering';
import { safeToString } from '@/utils/stringUtils';

/**
 * Component to safely display any value without risk of [object Object] rendering
 */
export const SafeDisplay: React.FC<SafeDisplayProps> = ({ 
  value, 
  fallback = '[object]' 
}) => {
  // If the value is null, undefined, or a primitive, we can render it directly
  if (value === null || value === undefined || 
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean') {
    return <>{String(value)}</>;
  }
  
  // Otherwise, safely convert to string
  const displayValue = safeToString(value, fallback);
  return <>{displayValue}</>;
};

/**
 * Component for debugging object displays - shows an inspectable preview
 */
export const DebugDisplay: React.FC<SafeDisplayProps & { 
  label?: string;
  expanded?: boolean;
}> = ({ 
  value, 
  fallback = 'Unknown value', 
  label,
  expanded = false
}) => {
  const displayValue = safeToString(value, fallback);
  const displayLabel = label || (typeof value);
  
  // For simple values, just show them directly
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null || value === undefined) {
    return (
      <div className="debug-display debug-simple">
        <span className="debug-label">{displayLabel}:</span> {displayValue}
      </div>
    );
  }
  
  // For objects, provide a collapsible view
  return (
    <details className="debug-display debug-object" open={expanded}>
      <summary className="debug-summary">{displayLabel}</summary>
      <div className="debug-content">
        {typeof value === 'object' && value !== null ? (
          <pre className="debug-json">
            {JSON.stringify(value, null, 2)}
          </pre>
        ) : (
          <span className="debug-value">{displayValue}</span>
        )}
      </div>
    </details>
  );
};

export default SafeDisplay;