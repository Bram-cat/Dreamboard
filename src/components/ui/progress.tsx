"use client";

import * as React from "react";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className = "", value = 0, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`relative h-2 w-full overflow-hidden rounded-full bg-purple-200 ${className}`}
        {...props}
      >
        <div
          className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500 ease-in-out"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    );
  }
);

Progress.displayName = "Progress";

export { Progress };
