import { useState } from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import ChatWidget from "@/components/organisms/ChatWidget"

const CustomerChatView = () => {
  const [widgetConfig, setWidgetConfig] = useState({
    position: "bottom-right",
    colors: {
      primary: "#4F46E5",
      header: "#4F46E5"
    },
    texts: {
      widgetButton: "Chat with us",
      header: "Customer Support",
      welcome: "Hi! How can we help you today?"
    }
  })

  const [showCustomizer, setShowCustomizer] = useState(false)

  const positions = [
    { value: "bottom-right", label: "Bottom Right" },
    { value: "bottom-left", label: "Bottom Left" },
    { value: "bottom-center", label: "Bottom Center" }
  ]

  const colorPresets = [
    { name: "Indigo", color: "#4F46E5" },
    { name: "Purple", color: "#7C3AED" },
    { name: "Cyan", color: "#06B6D4" },
    { name: "Emerald", color: "#10B981" },
    { name: "Rose", color: "#F43F5E" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary-200/30 to-accent-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-secondary-200/30 to-primary-200/30 rounded-full blur-3xl"></div>
      </div>

      {/* Demo Website Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Zap" size={20} className="text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  DemoSite
                </span>
              </div>
              
              <div className="hidden md:flex items-center gap-8">
                <a href="#" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">Home</a>
                <a href="#" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">Products</a>
                <a href="#" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">About</a>
                <a href="#" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">Contact</a>
              </div>

              <Button
                onClick={() => setShowCustomizer(!showCustomizer)}
                variant="outline"
                className="gap-2"
              >
                <ApperIcon name="Settings" size={16} />
                Customize Chat
              </Button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent mb-6"
            >
              ChatBridge Pro Demo
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              Experience our intelligent customer communication platform. Try the chat widget in the corner to see how seamlessly it integrates into your website.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button size="lg" className="gap-2 shadow-xl">
                <ApperIcon name="Play" size={20} />
                Start Chatting
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <ApperIcon name="BookOpen" size={20} />
                View Documentation
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "Bot",
                title: "AI-Powered Chatbot",
                description: "Intelligent responses to common questions with seamless handoff to human agents."
              },
              {
                icon: "Users",
                title: "Live Agent Support",
                description: "Connect customers with real support agents for complex issues and personalized help."
              },
              {
                icon: "Palette",
                title: "Full Customization",
                description: "Match your brand colors, position, and messaging with our flexible widget system."
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mb-4">
                  <ApperIcon name={feature.icon} size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Widget Customizer Panel */}
      {showCustomizer && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl border-l border-gray-200 z-50 overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Customize Widget</h2>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setShowCustomizer(false)}
              >
                <ApperIcon name="X" size={20} />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Position */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Position</label>
                <div className="grid grid-cols-1 gap-2">
                  {positions.map((pos) => (
                    <Button
                      key={pos.value}
                      variant={widgetConfig.position === pos.value ? "default" : "ghost"}
                      onClick={() => setWidgetConfig(prev => ({ ...prev, position: pos.value }))}
                      className="justify-start"
                    >
                      {pos.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Color Theme</label>
                <div className="grid grid-cols-2 gap-2">
                  {colorPresets.map((preset) => (
                    <Button
                      key={preset.name}
                      variant="ghost"
                      onClick={() => setWidgetConfig(prev => ({
                        ...prev,
                        colors: { primary: preset.color, header: preset.color }
                      }))}
                      className="gap-2 justify-start"
                    >
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: preset.color }}
                      />
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Welcome Message</label>
                <textarea
                  value={widgetConfig.texts.welcome}
                  onChange={(e) => setWidgetConfig(prev => ({
                    ...prev,
                    texts: { ...prev.texts, welcome: e.target.value }
                  }))}
                  className="w-full h-20 px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter welcome message..."
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Chat Widget */}
      <ChatWidget config={widgetConfig} />
    </div>
  )
}

export default CustomerChatView