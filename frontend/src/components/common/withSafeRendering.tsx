import { safeToString } from '@/utils/stringUtils'; /**
 * HOC that wraps a component to ensure all string props are safe from [object Object] rendering
 *
 * @param Component The React component to wrap
 * @param propsToProtect Optional list of specific props to protect (default: all string props)
 * @returns A wrapped component with safe string rendering
 */
import React from 'react';
export function withSafeRendering<P extends Record<string, unknown>>(
  Component: React.ComponentType<P>
): React.FC<P> {
  const displayName = Component.displayName || Component.name || 'Component';

  const WrappedComponent: React.FC<P> = (props) => {
    // Create a copy of props that we can safely modify
    const safeProps = { ...props } as P;

    // Always use safeToString for all object props (except React elements)
    (Object.entries(props) as [keyof P, unknown][]).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null && !React.isValidElement(value)) {
        safeProps[key] = safeToString(value) as unknown as P[keyof P];
      }
    });

    return <Component {...safeProps} />;
  };

  WrappedComponent.displayName = `WithSafeRendering(${displayName})`;

  return WrappedComponent;
}

export default withSafeRendering;