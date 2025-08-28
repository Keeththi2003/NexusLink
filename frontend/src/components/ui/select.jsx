import * as React from "react"
import { cn } from "../../lib/utils"

const Select = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <select
      className={cn(
        "flex h-10 w-full rounded-md border border-secondary-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-secondary-800 dark:bg-secondary-950 dark:ring-offset-secondary-950 dark:focus-visible:ring-primary-300",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Select.displayName = "Select"

export { Select }