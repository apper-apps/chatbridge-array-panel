import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Empty = ({ 
  title = "No data found", 
  message = "There's nothing to show here yet.", 
  action,
  actionText = "Get Started",
  icon = "Inbox",
  className 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center p-8 text-center ${className}`}
    >
      <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} size={32} className="text-gray-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md leading-relaxed">{message}</p>
      
      {action && (
        <Button onClick={action} className="gap-2">
          <ApperIcon name="Plus" size={16} />
          {actionText}
        </Button>
      )}
    </motion.div>
  )
}

export default Empty