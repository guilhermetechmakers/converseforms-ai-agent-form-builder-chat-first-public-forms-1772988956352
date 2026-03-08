import {
  Bot,
  Link,
  User,
  Plug,
  MessageSquare,
  Zap,
  Shield,
  BarChart3,
  type LucideIcon,
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  Bot,
  Link,
  User,
  Plug,
  MessageSquare,
  Zap,
  Shield,
  BarChart3,
}

export function getFeatureIcon(iconName: string): LucideIcon {
  return iconMap[iconName] ?? MessageSquare
}
