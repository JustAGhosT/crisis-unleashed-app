declare module '@/components/ui/alert' {
  import type { ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from 'react';
  import type { VariantProps } from 'class-variance-authority';

  const Alert: ForwardRefExoticComponent<
    HTMLAttributes<HTMLDivElement> &
      VariantProps<(props?: Record<string, unknown>) => string> &
      RefAttributes<HTMLDivElement>
  >;

  const AlertTitle: ForwardRefExoticComponent<
    HTMLAttributes<HTMLHeadingElement> &
      RefAttributes<HTMLHeadingElement>
  >;

  const AlertDescription: ForwardRefExoticComponent<
    HTMLAttributes<HTMLParagraphElement> &
      RefAttributes<HTMLParagraphElement>
  >;

  export { Alert, AlertTitle, AlertDescription };
}

declare module '@/components/ui/skeleton' {
  import type { HTMLAttributes } from 'react';

  function Skeleton(props: HTMLAttributes<HTMLDivElement>): JSX.Element;

  export { Skeleton };
}