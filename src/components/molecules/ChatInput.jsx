import { useState } from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"

const ChatInput = ({ onSend, disabled, placeholder = "Type your message..." }) => {
  const [message, setMessage] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSend(message.trim())
      setMessage("")
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 bg-white shadow-sm"
      />
      <Button
        type="submit"
        size="icon"
        disabled={!message.trim() || disabled}
        className={cn(
          "shrink-0 transition-all duration-200",
          message.trim() && !disabled 
            ? "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700" 
            : "bg-gray-200 hover:bg-gray-300"
        )}
      >
        <ApperIcon name="Send" size={16} />
      </Button>
    </form>
  )
}

export default ChatInput