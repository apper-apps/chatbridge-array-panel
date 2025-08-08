import { cn } from "@/utils/cn"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"

const StatusBadge = ({ status, className }) => {
  const statusConfig = {
    online: {
      variant: "success",
      icon: "Circle",
      text: "Online",
      iconClass: "fill-current"
    },
    offline: {
      variant: "secondary",
      icon: "Circle",
      text: "Offline",
      iconClass: "fill-current"
    },
    busy: {
      variant: "warning",
      icon: "Circle",
      text: "Busy",
      iconClass: "fill-current"
    },
    away: {
      variant: "warning",
      icon: "Circle",
      text: "Away",
      iconClass: "fill-current"
    }
  }

  const config = statusConfig[status] || statusConfig.offline

  return (
    <Badge variant={config.variant} className={cn("gap-1", className)}>
      <ApperIcon 
        name={config.icon} 
        size={8} 
        className={config.iconClass}
      />
      <span>{config.text}</span>
    </Badge>
  )
}

export default StatusBadge