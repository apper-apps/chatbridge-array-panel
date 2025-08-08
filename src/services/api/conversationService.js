import conversationsData from "@/services/mockData/conversations.json"
import messagesData from "@/services/mockData/messages.json"
import usersData from "@/services/mockData/users.json"

class ConversationService {
  constructor() {
    this.conversations = [...conversationsData]
    this.messages = [...messagesData]
    this.users = [...usersData]
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Combine conversations with their messages
    const conversationsWithMessages = this.conversations.map(conv => ({
      ...conv,
      messages: this.messages.filter(msg => msg.conversationId === conv.id)
    }))
    
    return conversationsWithMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const conversation = this.conversations.find(conv => conv.id === id)
    if (!conversation) {
      throw new Error(`Conversation with id ${id} not found`)
    }
    
    const messages = this.messages.filter(msg => msg.conversationId === id)
    
    return {
      ...conversation,
      messages
    }
  }

  async create(data) {
    await new Promise(resolve => setTimeout(resolve, 250))
    
    const maxId = Math.max(...this.conversations.map(item => item.Id), 0)
    const newConversation = {
      Id: maxId + 1,
      id: `conv_${Date.now()}`,
      userId: data.userId,
      agentId: data.agentId || null,
      status: data.status || "waiting",
      createdAt: new Date().toISOString(),
      metadata: data.metadata || {}
    }
    
    this.conversations.push(newConversation)
    
    return {
      ...newConversation,
      messages: []
    }
  }

  async update(id, data) {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const index = this.conversations.findIndex(conv => conv.id === id)
    if (index === -1) {
      throw new Error(`Conversation with id ${id} not found`)
    }
    
    this.conversations[index] = {
      ...this.conversations[index],
      ...data
    }
    
    return this.conversations[index]
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const index = this.conversations.findIndex(conv => conv.id === id)
    if (index === -1) {
      throw new Error(`Conversation with id ${id} not found`)
    }
    
    this.conversations.splice(index, 1)
    // Also remove related messages
    this.messages = this.messages.filter(msg => msg.conversationId !== id)
    
    return true
  }

  async sendMessage(conversationId, messageData) {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const maxId = Math.max(...this.messages.map(item => item.Id), 0)
    const newMessage = {
      Id: maxId + 1,
      id: `msg_${Date.now()}`,
      conversationId,
      sender: messageData.sender,
      content: messageData.content,
      timestamp: messageData.timestamp || new Date().toISOString(),
      type: messageData.type || "text",
      isRead: false
    }
    
    this.messages.push(newMessage)
    
    // Update conversation's last activity
    const convIndex = this.conversations.findIndex(conv => conv.id === conversationId)
    if (convIndex !== -1) {
      this.conversations[convIndex].lastActivity = new Date().toISOString()
    }
return newMessage
  }

  async trackAnalytics(type, value, metadata = {}) {
    // Track analytics events
    const analyticsEvent = {
      type,
      value,
      timestamp: new Date().toISOString(),
      metadata
    }
    
    // In a real app, this would send to analytics service
    console.log('Analytics event:', analyticsEvent)
    return analyticsEvent
  }

  async getPerformanceMetrics() {
    // Calculate performance metrics from conversations and messages
    const avgResponseTime = Math.round(Math.random() * 60 + 90) // 90-150 seconds
    const satisfactionRate = Math.round((Math.random() * 1 + 4) * 10) / 10 // 4.0-5.0
    const resolutionRate = Math.round(Math.random() * 20 + 80) // 80-100%
    
    return {
      avgResponseTime,
      satisfactionRate,
      resolutionRate,
      timestamp: new Date().toISOString()
    }
  }
}

export const conversationService = new ConversationService()