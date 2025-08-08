import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import MessageBubble from "@/components/molecules/MessageBubble"
import ChatInput from "@/components/molecules/ChatInput"
import TypingIndicator from "@/components/molecules/TypingIndicator"
import StatusBadge from "@/components/molecules/StatusBadge"
import { useConversations } from "@/hooks/useConversations"
import { useChatbot } from "@/hooks/useChatbot"

const ChatWindow = ({ onClose, config = {} }) => {
  const [isTyping, setIsTyping] = useState(false)
  const [typingAgent, setTypingAgent] = useState("")
  const messagesEndRef = useRef(null)
  
  const { currentConversation, sendMessage } = useConversations()
  const { getBotResponse, isProcessing } = useChatbot()
  
  const headerColor = config.colors?.header || "#4F46E5"
  const headerText = config.texts?.header || "Chat Support"
  const welcomeMessage = config.texts?.welcome || "Hi! How can we help you today?"

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentConversation?.messages])

  const handleSendMessage = async (content) => {
    // Send user message
    await sendMessage(content, "user")
    
    // Show typing indicator
    setIsTyping(true)
    setTypingAgent("Bot")
    
    // Simulate processing delay
    setTimeout(async () => {
      // Get bot response
      const botResponse = await getBotResponse(content)
      
      setIsTyping(false)
      
      // Send bot message
      await sendMessage(botResponse, "bot")
      
      // Check if should escalate to human agent
      if (botResponse.includes("transfer") || botResponse.includes("agent")) {
        setTimeout(() => {
          setIsTyping(true)
          setTypingAgent("Agent")
          
          setTimeout(async () => {
            setIsTyping(false)
            await sendMessage("Hi! I'm Sarah from our support team. I'll be happy to help you.", "agent")
          }, 1500)
        }, 1000)
      }
    }, 800 + Math.random() * 1200)
  }

  const messages = currentConversation?.messages || []
  const hasMessages = messages.length > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-80 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div 
        className="px-4 py-3 text-white rounded-t-2xl flex items-center justify-between"
        style={{ background: `linear-gradient(135deg, ${headerColor}, ${headerColor}dd)` }}
      >
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
            <ApperIcon name="MessageCircle" size={16} />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{headerText}</h3>
            <StatusBadge status="online" className="text-xs bg-white/20 text-white border-white/30" />
          </div>
        </div>
        
        <Button
          onClick={onClose}
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-white hover:bg-white/20 hover:scale-110"
        >
          <ApperIcon name="X" size={16} />
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-gradient-to-b from-gray-50 to-white">
        <div className="p-4">
          {!hasMessages && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                <ApperIcon name="Bot" size={24} className="text-primary-600" />
              </div>
              <p className="text-sm text-gray-600 mb-4">{welcomeMessage}</p>
            </motion.div>
          )}
          
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.sender === "user"}
              showAvatar={message.sender !== "user"}
              senderName={message.sender === "bot" ? "ChatBot" : message.sender === "agent" ? "Sarah" : ""}
              timestamp={message.timestamp}
            />
          ))}
          
          {isTyping && (
            <TypingIndicator senderName={typingAgent} />
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <ChatInput
        onSend={handleSendMessage}
        disabled={isProcessing}
        placeholder={isProcessing ? "Processing..." : "Type your message..."}
      />
    </motion.div>
  )
}

export default ChatWindow