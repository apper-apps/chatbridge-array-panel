import { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Badge = forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 border border-primary-300",
    success: "bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border border-emerald-300",
    warning: "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border border-amber-300",
    error: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300",
    secondary: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-all duration-200",
        variants[variant],
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

Badge.displayName = "Badge"
export default Badge