import { format } from "date-fns"
import { cn } from "@/utils/cn"
import Avatar from "@/components/atoms/Avatar"

const MessageBubble = ({ message, isOwn = false, showAvatar = true, senderName, timestamp }) => {
  const messageTime = timestamp ? new Date(timestamp) : new Date()
  
  return (
    <div className={cn(
      "flex gap-3 mb-4 message-appear",
      isOwn ? "flex-row-reverse" : "flex-row"
    )}>
      {showAvatar && !isOwn && (
        <Avatar 
          size="sm" 
          fallback={senderName?.charAt(0) || "B"} 
          className="mt-1"
        />
      )}
      
      <div className={cn(
        "flex flex-col max-w-[80%]",
        isOwn ? "items-end" : "items-start"
      )}>
        {!isOwn && senderName && (
          <span className="text-xs font-medium text-gray-600 mb-1 px-1">
            {senderName}
          </span>
        )}
        
        <div className={cn(
          "px-4 py-2 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md",
          isOwn 
            ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-tr-md" 
            : message.type === "bot"
              ? "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-tl-md border border-gray-300"
              : "bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-800 rounded-tl-md border border-secondary-300"
        )}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>
        
        <span className="text-xs text-gray-400 mt-1 px-1">
          {format(messageTime, "HH:mm")}
        </span>
      </div>
    </div>
  )
}

export default MessageBubble