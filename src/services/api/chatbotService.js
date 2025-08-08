import botResponsesData from "@/services/mockData/botResponses.json"

class ChatbotService {
  constructor() {
    this.responses = [...botResponsesData]
  }

  async processMessage(userMessage) {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 800))
    
    const message = userMessage.toLowerCase()
    
    // Find matching response based on keywords
    const matchedResponse = this.responses.find(response => 
      response.keywords.some(keyword => message.includes(keyword.toLowerCase()))
    )
    
    if (matchedResponse) {
      // Return random response from the matched category
      const responses = matchedResponse.responses
      return responses[Math.floor(Math.random() * responses.length)]
    }
    
    // Default responses for unmatched queries
    const defaultResponses = [
      "I understand you're looking for help. Let me connect you with one of our human agents who can better assist you with this specific question.",
      "That's an interesting question! I'd like to transfer you to a specialist who can provide you with detailed information about this topic.",
      "I want to make sure you get the most accurate information. Let me connect you with a human agent who can help you with this inquiry.",
      "I'm not quite sure about that specific question, but our support team definitely can help! Let me transfer you to an agent.",
    ]
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  async getQuickReplies() {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    return [
      "Hello! How can I help you?",
      "Thank you for contacting us.",
      "Is there anything else I can help with?",
      "Let me connect you with an agent.",
    ]
  }
}

export const chatbotService = new ChatbotService()