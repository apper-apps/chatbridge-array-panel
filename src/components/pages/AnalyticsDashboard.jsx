import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { analyticsService } from '@/services/api/analyticsService'
import Chart from 'react-apexcharts'

function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [overview, setOverview] = useState(null)
  const [chartData, setChartData] = useState([])
  const [performanceData, setPerformanceData] = useState([])
  const [topPages, setTopPages] = useState([])
  const [userEngagement, setUserEngagement] = useState(null)
  const [selectedPeriod, setSelectedPeriod] = useState('7days')
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    loadDashboardData()
  }, [selectedPeriod])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [overviewData, chartResponse, performanceResponse, pagesData, engagementData] = await Promise.all([
        analyticsService.getOverviewMetrics(),
        analyticsService.getChartData(selectedPeriod),
        analyticsService.getPerformanceMetrics(),
        analyticsService.getTopPages(),
        analyticsService.getUserEngagement()
      ])

      setOverview(overviewData)
      setChartData(chartResponse)
      setPerformanceData(performanceResponse)
      setTopPages(pagesData)
      setUserEngagement(engagementData)
    } catch (err) {
      setError('Failed to load analytics data')
      console.error('Analytics error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (type) => {
    try {
      setExporting(true)
      const result = await analyticsService.exportData(type, 'csv')
      toast.success(`${result.message}`)
    } catch (err) {
      toast.error('Failed to export data')
      console.error('Export error:', err)
    } finally {
      setExporting(false)
    }
  }

  const conversationChartOptions = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    colors: ['#4F46E5', '#7C3AED', '#06B6D4'],
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    xaxis: {
      categories: chartData.map(item => new Date(item.date).toLocaleDateString()),
      labels: {
        style: { colors: '#64748B', fontSize: '12px' }
      }
    },
    yaxis: {
      labels: {
        style: { colors: '#64748B', fontSize: '12px' }
      }
    },
    grid: {
      borderColor: '#E2E8F0',
      strokeDashArray: 3
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right'
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val.toLocaleString()
        }
      }
    }
  }

  const conversationChartSeries = [
    {
      name: 'Conversations',
      data: chartData.map(item => item.conversations)
    },
    {
      name: 'Messages',
      data: chartData.map(item => item.messages)
    },
    {
      name: 'Users',
      data: chartData.map(item => item.users)
    }
  ]

  const performanceChartOptions = {
    chart: {
      type: 'area',
      height: 300,
      toolbar: { show: false },
      sparkline: { enabled: true }
    },
    colors: ['#059669'],
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1
      }
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + 's'
        }
      }
    }
  }

  const performanceChartSeries = [{
    name: 'Response Time',
    data: performanceData.map(item => item.responseTime)
  }]

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadDashboardData} />

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-3"
              >
                <div className="p-2 bg-primary-100 rounded-lg">
                  <ApperIcon name="BarChart3" size={24} className="text-primary-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
                  <p className="text-sm text-gray-500">Monitor user interactions and performance metrics</p>
                </div>
              </motion.div>
            </div>
            
            <div className="flex items-center space-x-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="90days">Last 90 days</option>
              </select>
              
              <Button
                onClick={() => handleExport('overview')}
                variant="outline"
                size="sm"
                disabled={exporting}
                className="flex items-center space-x-2"
              >
                <ApperIcon name="Download" size={16} />
                <span>{exporting ? 'Exporting...' : 'Export'}</span>
              </Button>
              
              <Button
                onClick={loadDashboardData}
                variant="primary"
                size="sm"
                className="flex items-center space-x-2"
              >
                <ApperIcon name="RefreshCw" size={16} />
                <span>Refresh</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Conversations</p>
                <p className="text-3xl font-bold text-gray-900">{overview?.totalConversations || 0}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <ApperIcon name="MessageSquare" size={20} className="text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <Badge variant="success" className="text-xs">+12.5%</Badge>
              <p className="text-xs text-gray-500">from last period</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Messages</p>
                <p className="text-3xl font-bold text-gray-900">{overview?.totalMessages || 0}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <ApperIcon name="Send" size={20} className="text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <Badge variant="success" className="text-xs">+8.2%</Badge>
              <p className="text-xs text-gray-500">from last period</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                <p className="text-3xl font-bold text-gray-900">{overview?.avgResponseTime || 0}s</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <ApperIcon name="Clock" size={20} className="text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <Badge variant="success" className="text-xs">-5.3%</Badge>
              <p className="text-xs text-gray-500">faster than before</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Satisfaction Rate</p>
                <p className="text-3xl font-bold text-gray-900">{overview?.avgSatisfaction || 0}/5</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <ApperIcon name="Star" size={20} className="text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <Badge variant="success" className="text-xs">+0.2</Badge>
              <p className="text-xs text-gray-500">rating improvement</p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Conversation Trends Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Conversation Trends</h3>
              <div className="flex items-center space-x-2">
                <ApperIcon name="TrendingUp" size={16} className="text-green-600" />
                <span className="text-sm text-green-600 font-medium">+15.2%</span>
              </div>
            </div>
            
            {chartData.length > 0 && (
              <Chart
                options={conversationChartOptions}
                series={conversationChartSeries}
                type="line"
                height={350}
              />
            )}
          </motion.div>

          {/* Performance Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Response Time Trend</h3>
            
            {performanceData.length > 0 && (
              <Chart
                options={performanceChartOptions}
                series={performanceChartSeries}
                type="area"
                height={300}
              />
            )}

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Resolution Rate</span>
                <span className="text-sm font-semibold text-gray-900">{overview?.resolutionRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Agents</span>
                <span className="text-sm font-semibold text-gray-900">{overview?.activeAgents}</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Pages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Top Pages</h3>
              <Button
                onClick={() => handleExport('pages')}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <ApperIcon name="Download" size={14} />
                <span>Export</span>
              </Button>
            </div>

            <div className="space-y-4">
              {topPages.map((page, index) => (
                <div key={page.page} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{page.page}</p>
                      <p className="text-sm text-gray-500">{page.avgDuration} avg duration</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{page.visits.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{page.bounceRate}% bounce</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* User Engagement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">User Engagement</h3>
              <Badge variant="success">Live</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <ApperIcon name="Users" size={16} className="text-blue-600" />
                  <span className="text-sm text-blue-700 font-medium">New Users</span>
                </div>
                <p className="text-2xl font-bold text-blue-900">{userEngagement?.newUsers}</p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <ApperIcon name="UserCheck" size={16} className="text-green-600" />
                  <span className="text-sm text-green-700 font-medium">Returning</span>
                </div>
                <p className="text-2xl font-bold text-green-900">{userEngagement?.returningUsers}</p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <ApperIcon name="Clock" size={16} className="text-purple-600" />
                  <span className="text-sm text-purple-700 font-medium">Avg Session</span>
                </div>
                <p className="text-lg font-bold text-purple-900">{userEngagement?.avgSessionDuration}</p>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <ApperIcon name="Eye" size={16} className="text-orange-600" />
                  <span className="text-sm text-orange-700 font-medium">Page Views</span>
                </div>
                <p className="text-2xl font-bold text-orange-900">{userEngagement?.pageViews?.toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Bounce Rate</span>
                <span className="text-sm font-semibold text-gray-900">{userEngagement?.bounceRate}%</span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${100 - (userEngagement?.bounceRate || 0)}%` }}
                ></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsDashboard