import { useState } from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import AgentChatList from "@/components/organisms/AgentChatList"
import AgentChatView from "@/components/organisms/AgentChatView"
import { useConversations } from "@/hooks/useConversations"
import { useNavigate } from "react-router-dom"

const AgentDashboard = () => {
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  
  const { conversations, stats } = useConversations()
  const navigate = useNavigate()

  const handleSelectChat = (conversation) => {
    setSelectedConversation(conversation)
    // Mark messages as read
    conversation.messages.forEach(msg => {
      if (!msg.isRead && msg.sender !== "agent") {
        msg.isRead = true
      }
    })
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex overflow-hidden">
      {/* Desktop Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-16'} hidden lg:block bg-white border-r border-gray-200 transition-all duration-300 shadow-lg`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-accent-50">
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                    <ApperIcon name="MessageSquare" size={20} className="text-white" />
                  </div>
                  <div>
                    <h1 className="font-bold text-lg bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                      ChatBridge Pro
                    </h1>
                    <p className="text-sm text-gray-600">Agent Dashboard</p>
                  </div>
                </motion.div>
              )}
              
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="shrink-0"
              >
                <ApperIcon name={sidebarOpen ? "PanelLeftClose" : "PanelLeftOpen"} size={20} />
              </Button>
            </div>
          </div>

          {/* Stats */}
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 border-b border-gray-200"
            >
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div className="text-xl font-bold text-green-700">{stats.activeChats || 0}</div>
                  <div className="text-xs text-green-600">Active</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200">
                  <div className="text-xl font-bold text-amber-700">{stats.waitingChats || 0}</div>
                  <div className="text-xs text-amber-600">Waiting</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                  <div className="text-xl font-bold text-blue-700">{stats.totalChats || 0}</div>
                  <div className="text-xs text-blue-600">Total</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Chat List */}
          {sidebarOpen ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 overflow-hidden"
            >
              <AgentChatList
                onSelectChat={handleSelectChat}
                selectedChatId={selectedConversation?.id}
              />
            </motion.div>
          ) : (
            <div className="flex-1 p-2 space-y-2">
              {conversations.slice(0, 5).map((conv) => {
                const unreadCount = conv.messages.filter(msg => !msg.isRead && msg.sender !== "agent").length
                return (
                  <div
                    key={conv.id}
                    className="relative cursor-pointer"
                    onClick={() => {
                      handleSelectChat(conv)
                      setSidebarOpen(true)
                    }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg flex items-center justify-center text-white font-semibold hover:from-primary-500 hover:to-primary-600 transition-all">
                      {conv.userId.charAt(0).toUpperCase()}
                    </div>
                    {unreadCount > 0 && (
                      <Badge variant="error" className="absolute -top-1 -right-1 text-xs h-4 min-w-4 p-0 flex items-center justify-center">
                        {unreadCount}
                      </Badge>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className={`lg:hidden fixed inset-0 z-50 ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300">
          <div className="h-full flex flex-col">
            {/* Mobile Header */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-accent-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                    <ApperIcon name="MessageSquare" size={20} className="text-white" />
                  </div>
                  <div>
                    <h1 className="font-bold text-lg bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                      ChatBridge Pro
                    </h1>
                    <p className="text-sm text-gray-600">Agent Dashboard</p>
                  </div>
                </div>
                
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setSidebarOpen(false)}
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>
            </div>

            {/* Mobile Stats */}
            <div className="p-4 border-b border-gray-200">
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div className="text-xl font-bold text-green-700">{stats.activeChats || 0}</div>
                  <div className="text-xs text-green-600">Active</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200">
                  <div className="text-xl font-bold text-amber-700">{stats.waitingChats || 0}</div>
                  <div className="text-xs text-amber-600">Waiting</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                  <div className="text-xl font-bold text-blue-700">{stats.totalChats || 0}</div>
                  <div className="text-xs text-blue-600">Total</div>
                </div>
              </div>
            </div>

            {/* Mobile Chat List */}
            <div className="flex-1 overflow-hidden">
              <AgentChatList
                onSelectChat={(conv) => {
                  handleSelectChat(conv)
                  setSidebarOpen(false)
                }}
                selectedChatId={selectedConversation?.id}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center gap-4">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <ApperIcon name="Menu" size={20} />
            </Button>
            
            <div className="flex items-center gap-3">
              <Badge variant="success" className="gap-1">
                <ApperIcon name="Circle" size={8} className="fill-current" />
                Online
              </Badge>
              <span className="text-sm text-gray-600">Agent: Sarah Johnson</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <ApperIcon name="Eye" size={16} />
              View Customer Site
            </Button>
            
            <Button size="icon" variant="ghost">
              <ApperIcon name="Settings" size={20} />
            </Button>
          </div>
        </div>

        {/* Chat View */}
        <AgentChatView conversation={selectedConversation} />
      </div>
    </div>
  )
}

export default AgentDashboard