import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-800 transition-all outline-none placeholder:text-slate-400 focus:border-[#015C3A] focus:ring-1 focus:ring-[#015C3A] disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 dark:focus:border-emerald-500",
        className
      )}
      {...props}
    />
  )
}

export { Input }
