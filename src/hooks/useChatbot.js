import { useState } from "react"
import { chatbotService } from "@/services/api/chatbotService"

export const useChatbot = () => {
  const [isProcessing, setIsProcessing] = useState(false)

  const getBotResponse = async (userMessage) => {
    setIsProcessing(true)
    
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000))
      
      const response = await chatbotService.processMessage(userMessage)
      return response
    } catch (err) {
      console.error("Bot response error:", err)
      return "I'm sorry, I'm having trouble processing your request right now. Let me connect you with a human agent."
    } finally {
      setIsProcessing(false)
    }
  }

  return {
    getBotResponse,
    isProcessing
  }
}