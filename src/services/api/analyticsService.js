import analyticsData from '@/services/mockData/analytics.json'
import messagesData from '@/services/mockData/messages.json'
import conversationsData from '@/services/mockData/conversations.json'
import usersData from '@/services/mockData/users.json'
import agentsData from '@/services/mockData/agents.json'

class AnalyticsService {
  constructor() {
    this.data = [...analyticsData]
    this.lastId = Math.max(...this.data.map(item => item.Id), 0)
  }

  async getOverviewMetrics() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const totalConversations = conversationsData.length
    const totalMessages = messagesData.length
    const totalUsers = usersData.length
    const activeAgents = agentsData.filter(agent => agent.status === 'online').length

    // Calculate average response time
    const responseTimes = this.data
      .filter(item => item.type === 'response_time')
      .map(item => item.value)
    const avgResponseTime = responseTimes.length > 0 
      ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
      : 0

    // Calculate satisfaction rate
    const satisfactionScores = this.data
      .filter(item => item.type === 'satisfaction')
      .map(item => item.value)
    const avgSatisfaction = satisfactionScores.length > 0
      ? Math.round((satisfactionScores.reduce((a, b) => a + b, 0) / satisfactionScores.length) * 100) / 100
      : 0

    // Calculate resolution rate
    const resolvedConversations = conversationsData.filter(conv => 
      conv.metadata?.resolved === true || conv.status === 'closed'
    ).length
    const resolutionRate = totalConversations > 0 
      ? Math.round((resolvedConversations / totalConversations) * 100)
      : 0

    return {
      totalConversations,
      totalMessages,
      totalUsers,
      activeAgents,
      avgResponseTime,
      avgSatisfaction,
      resolutionRate
    }
  }

  async getChartData(period = '7days') {
    await new Promise(resolve => setTimeout(resolve, 300))

    const now = new Date()
    let days = 7
    
    if (period === '30days') days = 30
    if (period === '90days') days = 90

    const chartData = []
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      // Generate realistic data based on day of week
      const dayOfWeek = date.getDay()
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
      
      const baseConversations = isWeekend ? 15 : 45
      const baseMessages = isWeekend ? 85 : 280
      const baseUsers = isWeekend ? 12 : 38
      
      const variance = 0.3
      const conversations = Math.round(baseConversations * (1 + (Math.random() - 0.5) * variance))
      const messages = Math.round(baseMessages * (1 + (Math.random() - 0.5) * variance))
      const users = Math.round(baseUsers * (1 + (Math.random() - 0.5) * variance))
      
      chartData.push({
        date: dateStr,
        conversations,
        messages,
        users,
        responseTime: Math.round(120 + (Math.random() - 0.5) * 60), // 90-150 seconds
        satisfaction: Math.round((4.2 + (Math.random() - 0.5) * 1.2) * 10) / 10 // 3.6-4.8
      })
    }

    return chartData
  }

  async getPerformanceMetrics(timeRange = '24h') {
    await new Promise(resolve => setTimeout(resolve, 400))

    // Generate hourly data for the last 24 hours
    const hours = []
    const now = new Date()
    
    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now)
      hour.setHours(hour.getHours() - i)
      
      const hourValue = hour.getHours()
      
      // Peak hours: 9-11 AM, 2-4 PM, 7-9 PM
      const isPeakHour = (hourValue >= 9 && hourValue <= 11) || 
                        (hourValue >= 14 && hourValue <= 16) || 
                        (hourValue >= 19 && hourValue <= 21)
      
      const baseResponseTime = isPeakHour ? 180 : 90 // Peak hours have slower response
      const baseThroughput = isPeakHour ? 25 : 15
      
      hours.push({
        hour: hour.toISOString(),
        responseTime: Math.round(baseResponseTime + (Math.random() - 0.5) * 40),
        throughput: Math.round(baseThroughput + (Math.random() - 0.5) * 8),
        errorRate: Math.round((Math.random() * 2 + 0.5) * 10) / 10, // 0.5-2.5%
        satisfaction: Math.round((4.0 + Math.random() * 1.0) * 10) / 10 // 4.0-5.0
      })
    }

    return hours
  }

  async getTopPages() {
    await new Promise(resolve => setTimeout(resolve, 200))

    return [
      { page: '/chat', visits: 2847, bounceRate: 12.3, avgDuration: '4m 32s' },
      { page: '/support', visits: 1923, bounceRate: 18.7, avgDuration: '3m 18s' },
      { page: '/pricing', visits: 1456, bounceRate: 25.4, avgDuration: '2m 45s' },
      { page: '/features', visits: 987, bounceRate: 31.2, avgDuration: '2m 12s' },
      { page: '/contact', visits: 743, bounceRate: 42.1, avgDuration: '1m 56s' }
    ]
  }

  async getUserEngagement() {
    await new Promise(resolve => setTimeout(resolve, 250))

    return {
      newUsers: 156,
      returningUsers: 432,
      totalSessions: 588,
      avgSessionDuration: '6m 23s',
      pageViews: 2847,
      bounceRate: 23.4
    }
  }

  async exportData(type = 'overview', format = 'csv') {
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Simulate export generation
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `analytics-${type}-${timestamp}.${format}`
    
    // In a real app, this would generate and download the actual file
    return {
      success: true,
      filename,
      downloadUrl: `/downloads/${filename}`,
      message: `${type} data exported successfully`
    }
  }
}

export const analyticsService = new AnalyticsService()