import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base styles with corporate colors
        "flex h-10 w-full min-w-0 rounded-lg border bg-card px-4 py-2",
        "text-base font-light text-foreground",
        "placeholder:text-muted-foreground/60 placeholder:font-light",
        "border-border bg-card/50 backdrop-blur-sm",
        "transition-all duration-200",
        "shadow-sm shadow-black/5",
        
        // Focus states with corporate primary
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
        "focus-visible:border-primary focus-visible:bg-card",
        
        // Hover states
        "hover:border-primary/50 hover:bg-card/80",
        
        // Selection colors
        "selection:bg-primary selection:text-primary-foreground",
        
        // File input styles
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        
        // Disabled states
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/20",
        
        // Error states
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        
        className
      )}
      {...props}
    />
  )
}

export { Input }
