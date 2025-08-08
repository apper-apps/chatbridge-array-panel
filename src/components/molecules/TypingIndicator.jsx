import Avatar from "@/components/atoms/Avatar"

const TypingIndicator = ({ senderName = "Agent" }) => {
  return (
    <div className="flex gap-3 mb-4 message-appear">
      <Avatar 
        size="sm" 
        fallback={senderName.charAt(0)} 
        className="mt-1"
      />
      
      <div className="flex flex-col">
        <span className="text-xs font-medium text-gray-600 mb-1 px-1">
          {senderName} is typing...
        </span>
        
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-3 rounded-2xl rounded-tl-md border border-gray-300 shadow-sm">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TypingIndicator