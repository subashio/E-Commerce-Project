import { cn } from "@/lib/utils";
import React from "react";

interface LogosProps extends React.SVGProps<SVGSVGElement> {
  d: string; // Custom prop for path data
  size?: string; // Custom prop for size
  color?: string; // Custom prop for color
  strokeWidth?: string; // Custom prop for strokeWidth
}

const Logos = React.forwardRef<SVGSVGElement, LogosProps>(
  (
    {
      className,
      d,
      size = "24",
      color = "currentColor",
      strokeWidth = "2",
      ...props
    },
    ref,
  ) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      fill={color}
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm", // Default styles
        className, // Custom class overrides
      )}
      aria-hidden="true" // Accessibility attribute
      {...props} // Spread other SVG props (onClick, etc.)
    >
      <path
        fillRule="evenodd"
        d={d}
        strokeLinecap="round"
        strokeLinejoin="round"
        clipRule="evenodd"
      />
    </svg>
  ),
);

Logos.displayName = "Logos";

export default Logos;
