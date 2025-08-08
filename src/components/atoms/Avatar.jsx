import { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Avatar = forwardRef(({ className, src, alt, fallback, size = "default", ...props }, ref) => {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    default: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  }

  return (
    <div
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-gray-200 to-gray-300",
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="aspect-square h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-400 to-primary-600 text-white font-semibold">
          {fallback}
        </div>
      )}
    </div>
  )
})

Avatar.displayName = "Avatar"
export default Avatar