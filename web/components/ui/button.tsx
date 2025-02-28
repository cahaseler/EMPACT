import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center w-fit whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-indigo-700/90 hover:bg-indigo-700/70 text-indigo-50",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border-2 border-indigo-700/90 bg-transparent hover:bg-transparent hover:border-indigo-700/70 text-indigo-700/90 hover:text-indigo-700/70",
        dateInput:
          "border-2 border-indigo-100 bg-white hover:bg-white dark:border-indigo-900 dark:bg-black dark:hover:border-indigo-900 dark:hover:bg-black font-normal text-black dark:text-white",
        secondary:
          "bg-indigo-100 hover:bg-indigo-200",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-6 py-2",
        offset: "w-full justify-start h-10 px-3 py-2",
        lg: "h-11 rounded-md px-8 text-md",
        xl: "w-full h-28 py-3 px-8 text-left",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
