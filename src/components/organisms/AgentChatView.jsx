import { useState, useRef, useEffect } from "react"
import { format } from "date-fns"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import MessageBubble from "@/components/molecules/MessageBubble"
import ChatInput from "@/components/molecules/ChatInput"
import { useConversations } from "@/hooks/useConversations"

const AgentChatView = ({ conversation }) => {
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  
  const { sendMessage } = useConversations()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversation?.messages])

  const handleSendMessage = async (content) => {
    if (!conversation) return
    
    setIsTyping(true)
    await sendMessage(content, "agent", conversation.id)
    setIsTyping(false)
  }

  const handleStatusChange = (newStatus) => {
    // This would typically update the conversation status
    console.log("Changing status to:", newStatus)
  }

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <ApperIcon name="MessageSquare" size={64} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No conversation selected</h3>
          <p className="text-gray-400">Select a conversation from the list to start chatting</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-white to-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
              {conversation.userId.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{conversation.userId}</h3>
              <p className="text-sm text-gray-500">
                Started {format(new Date(conversation.createdAt), "MMM dd, HH:mm")}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge 
              variant={
                conversation.status === "active" ? "success" :
                conversation.status === "waiting" ? "warning" : 
                "secondary"
              }
            >
              {conversation.status}
            </Badge>
            
            <div className="flex gap-1">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleStatusChange("active")}
                title="Mark as active"
              >
                <ApperIcon name="Play" size={16} />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleStatusChange("closed")}
                title="Close conversation"
              >
                <ApperIcon name="X" size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-gradient-to-b from-gray-50 to-white">
        <div className="p-6">
          {conversation.messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.sender === "agent"}
              showAvatar={message.sender !== "agent"}
              senderName={
                message.sender === "bot" ? "ChatBot" : 
                message.sender === "user" ? conversation.userId :
                "You"
              }
              timestamp={message.timestamp}
            />
          ))}
          
          {isTyping && (
            <div className="flex justify-end mb-4">
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-2xl rounded-tr-md">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 py-2 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex gap-2 flex-wrap">
          {[
            "Hello! How can I help you?",
            "Thank you for contacting us.",
            "Let me check that for you.",
            "Is there anything else I can help with?"
          ].map((quickMessage, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={() => handleSendMessage(quickMessage)}
              className="text-xs"
            >
              {quickMessage}
            </Button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <ChatInput
        onSend={handleSendMessage}
        disabled={isTyping || conversation.status === "closed"}
        placeholder={
          conversation.status === "closed" 
            ? "This conversation is closed" 
            : "Type your response..."
        }
      />
    </div>
  )
}

export default AgentChatView