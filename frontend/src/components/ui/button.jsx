import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "../../lib/utils"

const buttonVariants = {
  variant: {
    default: "bg-primary-600 hover:bg-primary-700 text-white shadow-sm",
    destructive: "bg-red-600 hover:bg-red-700 text-white shadow-sm",
    outline: "border border-secondary-300 bg-white hover:bg-secondary-50 text-secondary-700 dark:border-secondary-600 dark:bg-secondary-800 dark:hover:bg-secondary-700 dark:text-secondary-200",
    secondary: "bg-secondary-100 hover:bg-secondary-200 text-secondary-900 dark:bg-secondary-800 dark:hover:bg-secondary-700 dark:text-secondary-200",
    ghost: "hover:bg-secondary-100 hover:text-secondary-900 dark:hover:bg-secondary-800 dark:hover:text-secondary-200",
    link: "text-primary-600 underline-offset-4 hover:underline dark:text-primary-400",
  },
  size: {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  },
}

const Button = React.forwardRef(({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-secondary-950",
        buttonVariants.variant[variant],
        buttonVariants.size[size],
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }