declare module '@/components/ui/alert' {
  import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react';
  import { VariantProps } from 'class-variance-authority';

  const Alert: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLDivElement> &
      VariantProps<(props?: Record<string, unknown>) => string> &
      React.RefAttributes<HTMLDivElement>
  >;

  const AlertTitle: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLHeadingElement> &
      React.RefAttributes<HTMLParagraphElement>
  >;

  const AlertDescription: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLParagraphElement> &
      React.RefAttributes<HTMLParagraphElement>
  >;

  export { Alert, AlertTitle, AlertDescription };
}

declare module '@/components/ui/skeleton' {
  import React from 'react';

  function Skeleton(props: React.HTMLAttributes<HTMLDivElement>): JSX.Element;

  export { Skeleton };
}