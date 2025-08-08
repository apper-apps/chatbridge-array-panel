import { useState, useEffect } from "react"
import { conversationService } from "@/services/api/conversationService"
import { toast } from "react-toastify"

export const useConversations = () => {
  const [conversations, setConversations] = useState([])
  const [currentConversation, setCurrentConversation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const loadConversations = async () => {
    setLoading(true)
    setError("")
    
    try {
      const data = await conversationService.getAll()
      setConversations(data)
      
      // Set current conversation to first active one or create new
      const activeConv = data.find(conv => conv.status === "active")
      if (activeConv) {
        setCurrentConversation(activeConv)
      } else {
        // Create new conversation for current user
        const newConv = await conversationService.create({
          userId: `user_${Date.now()}`,
          status: "active"
        })
        setCurrentConversation(newConv)
        setConversations([newConv, ...data])
      }
    } catch (err) {
      setError("Failed to load conversations")
      console.error("Conversation loading error:", err)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async (content, sender, conversationId = null) => {
    const targetId = conversationId || currentConversation?.id
    if (!targetId) return

    try {
      const newMessage = await conversationService.sendMessage(targetId, {
        content,
        sender,
        timestamp: new Date().toISOString()
      })

      // Update conversations state
      setConversations(prev => prev.map(conv => {
        if (conv.id === targetId) {
          return {
            ...conv,
            messages: [...conv.messages, newMessage]
          }
        }
        return conv
      }))

      // Update current conversation
      if (currentConversation?.id === targetId) {
        setCurrentConversation(prev => ({
          ...prev,
          messages: [...prev.messages, newMessage]
        }))
      }

      return newMessage
    } catch (err) {
      toast.error("Failed to send message")
      console.error("Message sending error:", err)
    }
  }

  const stats = {
    totalChats: conversations.length,
    activeChats: conversations.filter(conv => conv.status === "active").length,
    waitingChats: conversations.filter(conv => conv.status === "waiting").length,
    closedChats: conversations.filter(conv => conv.status === "closed").length
  }

  useEffect(() => {
    loadConversations()
  }, [])

  return {
    conversations,
    currentConversation,
    loading,
    error,
    stats,
    sendMessage,
    loadConversations
  }
}