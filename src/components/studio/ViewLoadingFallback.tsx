import React from 'react';
import { StudioSkeleton, StudioSkeletonVariant } from './StudioSkeleton';

interface ViewLoadingFallbackProps {
  variant?: StudioSkeletonVariant;
  message?: string;
  minHeight?: string | number;
}

export const ViewLoadingFallback: React.FC<ViewLoadingFallbackProps> = ({
  variant = 'workspace',
  message
}) => {
  return <StudioSkeleton variant={variant} customMessage={message} />;
};

export { StudioSkeleton };
export type { StudioSkeletonVariant };
