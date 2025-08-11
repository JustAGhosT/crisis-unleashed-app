import React from 'react';
import { safeToString } from '@/utils/stringUtils';

// Props that should never be stringified as they are special React props
const REACT_RESERVED_PROPS = [
  'children',
  'style',
  'ref',
  'key',
  'className',
  'dangerouslySetInnerHTML',
  'onFocus',
  'onBlur',
  'onChange',
  'onClick',
  'onContextMenu',
  'onDrag',
  'onDragEnd',
  'onDragEnter',
  'onDragExit',
  'onDragLeave',
  'onDragOver',
  'onDragStart',
  'onDrop',
  'onMouseDown',
  'onMouseEnter',
  'onMouseLeave',
  'onMouseMove',
  'onMouseOut',
  'onMouseOver',
  'onMouseUp',
  'onKeyDown',
  'onKeyPress',
  'onKeyUp',
  'onSubmit',
  'onReset',
  'onScroll',
  'onWheel'
];

/**
 * HOC that wraps a component to ensure all string props are safe from [object Object] rendering
 *
 * @param Component The React component to wrap
 * @param propsToProtect Optional list of specific props to protect (default: all string props)
 * @param additionalReservedProps Optional list of additional props to never stringify
 * @returns A wrapped component with safe string rendering
 */
export function withSafeRendering<P extends Record<string, unknown>>(
  Component: React.ComponentType<P>,
  propsToProtect?: Array<keyof P>,
  additionalReservedProps?: Array<string>
): React.FC<P> {
  const displayName = Component.displayName || Component.name || 'Component';
  
  // Combine default reserved props with any additional ones
  const reservedProps = [
    ...REACT_RESERVED_PROPS,
    ...(additionalReservedProps || [])
  ];

  const WrappedComponent: React.FC<P> = (props) => {
    // Create a copy of props that we can safely modify
    const safeProps = { ...props } as P;

    // If specific props are provided, only protect those
    if (propsToProtect && propsToProtect.length > 0) {
      propsToProtect.forEach((key) => {
        const value = props[key];
        const keyStr = String(key);
        
        // Skip reserved props
        if (reservedProps.includes(keyStr)) {
          return;
        }
        
        if (typeof value === 'object' && value !== null && !React.isValidElement(value)) {
          safeProps[key] = safeToString(value) as unknown as P[keyof P];
        }
      });
    } else {
      // Otherwise, protect all object props (except React elements and reserved props)
      (Object.entries(props) as [keyof P, unknown][]).forEach(([key, value]) => {
        const keyStr = String(key);
        
        // Skip reserved props
        if (reservedProps.includes(keyStr)) {
          return;
        }
        
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