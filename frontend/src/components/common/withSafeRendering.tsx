import React from 'react';
import { safeToString } from '@/utils/stringUtils';/**
 * HOC that wraps a component to ensure all string props are safe from [object Object] rendering
 * 
 * @param Component The React component to wrap
 * @param propsToProtect Optional list of specific props to protect (default: all string props)
 * @returns A wrapped component with safe string rendering
 */
export function withSafeRendering<P extends Record<string, unknown>>(
  Component: React.ComponentType<P>,
  propsToProtect?: Array<keyof P>
): React.FC<P> {
  const displayName = Component.displayName || Component.name || 'Component';

  const WrappedComponent: React.FC<P> = (props) => {
    // Create a copy of props that we can safely modify
    const safeProps = { ...props } as P;
    
    // If specific props are provided, only protect those
    if (propsToProtect && propsToProtect.length > 0) {
      propsToProtect.forEach(propName => {
        const propValue = props[propName];
        if (typeof propValue === 'object' && propValue !== null && !React.isValidElement(propValue)) {
          safeProps[propName] = safeToString(propValue) as unknown as P[keyof P];
        }
      });
    }
    // Otherwise, protect all props that might be rendered as strings
    else {
      // We can safely use Object.entries because we've constrained P to Record<string, unknown>
      (Object.entries(props) as [keyof P, unknown][]).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null && !React.isValidElement(value)) {
          safeProps[key] = safeToString(value) as unknown as P[keyof P];
        }
      });
    }

    return <Component {...safeProps} />;
  };

  WrappedComponent.displayName = `WithSafeRendering(${displayName})`;

  return WrappedComponent;
}

export default withSafeRendering;