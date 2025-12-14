import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    ref={ref}
    {...props}
    className={cn(
      `
      group peer relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full
      transition-colors border border-transparent
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring 
      focus-visible:ring-offset-2 focus-visible:ring-offset-background
      disabled:cursor-not-allowed disabled:opacity-50

      /* OFF background */
      data-[state=unchecked]:bg-[var(--color-secondary)]

      /* ON background */
      data-[state=checked]:bg-[var(--color-primary)]
    `,
      className
    )}
  >
    {/* Slider Thumb */}
    <SwitchPrimitives.Thumb
      className={cn(`
        pointer-events-none absolute h-7 w-7 rounded-full bg-white shadow-md 
        transition-transform duration-300 ease-in-out
        -left-1 top-0.5

        data-[state=checked]:translate-x-7
        data-[state=unchecked]:translate-x-1
      `)}
    />

    {/* Checkmark icon */}
    <svg
      viewBox="0 0 32 32"
      className="
        absolute h-3 w-3 stroke-[5] stroke-black 
        transition-all duration-300 ease-in-out
        opacity-0 
        right-8 top-2.5

        group-data-[state=checked]:opacity-100
        group-data-[state=checked]:right-2.5
      "
    >
      <path fill="none" d="m4 16.5 8 8 16-16" />
    </svg>
  </SwitchPrimitives.Root>
));

Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
