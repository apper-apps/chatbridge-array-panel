import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import ChatWindow from "./ChatWindow"
import { useConversations } from "@/hooks/useConversations"

const ChatWidget = ({ config = {} }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const { currentConversation } = useConversations()
  
  const position = config.position || "bottom-right"
  const primaryColor = config.colors?.primary || "#4F46E5"
  const widgetText = config.texts?.widgetButton || "Chat with us"

  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "bottom-center": "bottom-6 left-1/2 transform -translate-x-1/2"
  }

  // Update unread count when new messages arrive
  useEffect(() => {
    if (currentConversation && !isOpen) {
      const newMessages = currentConversation.messages.filter(
        msg => !msg.isRead && msg.sender !== "user"
      )
      setUnreadCount(newMessages.length)
    } else {
      setUnreadCount(0)
    }
  }, [currentConversation, isOpen])

  const handleToggle = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setUnreadCount(0)
    }
  }

  return (
    <div className={cn("fixed z-50", positionClasses[position])}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mb-4 mr-0"
          >
            <ChatWindow onClose={() => setIsOpen(false)} config={config} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <Button
          onClick={handleToggle}
          className={cn(
            "h-14 w-14 rounded-full shadow-2xl transition-all duration-300 border-0 widget-pulse",
            isOpen 
              ? "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700" 
              : "bg-gradient-to-r hover:shadow-2xl"
          )}
          style={{
            background: isOpen 
              ? undefined
              : `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)`
          }}
          aria-label={isOpen ? "Close chat" : widgetText}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ApperIcon name="X" size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ApperIcon name="MessageCircle" size={24} />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>

        {unreadCount > 0 && !isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2"
          >
            <Badge variant="error" className="h-6 min-w-[24px] rounded-full px-2 text-xs font-bold shadow-lg">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default ChatWidget