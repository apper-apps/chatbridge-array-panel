import { useState } from "react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import Badge from "@/components/atoms/Badge"
import Input from "@/components/atoms/Input"
import Button from "@/components/atoms/Button"
import { useConversations } from "@/hooks/useConversations"

const AgentChatList = ({ onSelectChat, selectedChatId }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  
  const { conversations, loading } = useConversations()

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.messages.some(msg => 
      msg.content.toLowerCase().includes(searchTerm.toLowerCase())
    ) || conv.userId.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || conv.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getLastMessage = (conversation) => {
    const lastMsg = conversation.messages[conversation.messages.length - 1]
    return lastMsg ? lastMsg.content : "No messages yet"
  }

  const getLastMessageTime = (conversation) => {
    const lastMsg = conversation.messages[conversation.messages.length - 1]
    return lastMsg ? new Date(lastMsg.timestamp) : new Date(conversation.createdAt)
  }

  const getUnreadCount = (conversation) => {
    return conversation.messages.filter(msg => !msg.isRead && msg.sender !== "agent").length
  }

  const statusOptions = [
    { value: "all", label: "All Chats" },
    { value: "active", label: "Active" },
    { value: "waiting", label: "Waiting" },
    { value: "closed", label: "Closed" }
  ]

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-16 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Search and Filter */}
      <div className="p-4 space-y-3 border-b border-gray-200 bg-gradient-to-r from-white to-gray-50">
        <Input
          placeholder="Search conversations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
        
        <div className="flex gap-2 flex-wrap">
          {statusOptions.map((option) => (
            <Button
              key={option.value}
              variant={statusFilter === option.value ? "default" : "ghost"}
              size="sm"
              onClick={() => setStatusFilter(option.value)}
              className="text-xs"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <ApperIcon name="MessageCircle" size={48} className="mx-auto mb-4 opacity-50" />
            <p>No conversations found</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {filteredConversations.map((conversation) => {
              const isSelected = conversation.id === selectedChatId
              const unreadCount = getUnreadCount(conversation)
              const lastMessage = getLastMessage(conversation)
              const lastMessageTime = getLastMessageTime(conversation)
              
              return (
                <motion.div
                  key={conversation.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "p-3 rounded-xl cursor-pointer transition-all duration-200 border-2",
                    isSelected 
                      ? "bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200 shadow-md" 
                      : "bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 border-gray-100 hover:border-gray-200 hover:shadow-sm"
                  )}
                  onClick={() => onSelectChat(conversation)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {conversation.userId.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-900">
                          {conversation.userId}
                        </p>
                        <Badge 
                          variant={
                            conversation.status === "active" ? "success" :
                            conversation.status === "waiting" ? "warning" : 
                            "secondary"
                          }
                          className="text-xs mt-1"
                        >
                          {conversation.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xs text-gray-400">
                        {format(lastMessageTime, "HH:mm")}
                      </p>
                      {unreadCount > 0 && (
                        <Badge variant="error" className="mt-1 text-xs">
                          {unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 truncate">
                    {lastMessage}
                  </p>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default AgentChatList