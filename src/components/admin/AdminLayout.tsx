import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Gauge,
  CreditCard,
  FileText,
  Flag,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/admin', end: true, label: 'Overview', icon: LayoutDashboard },
  { to: '/admin/users', end: false, label: 'Users', icon: Users },
  { to: '/admin/quotas', end: false, label: 'Quotas', icon: Gauge },
  { to: '/admin/billing', end: false, label: 'Billing', icon: CreditCard },
  { to: '/admin/logs', end: false, label: 'Logs', icon: FileText },
  { to: '/admin/flags', end: false, label: 'Settings & Flags', icon: Flag },
  { to: '/admin/analytics', end: false, label: 'Analytics', icon: BarChart3 },
]

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={cn(
          'flex h-full flex-col border-r border-border bg-card transition-[width] duration-200',
          collapsed ? 'w-[72px]' : 'w-56'
        )}
      >
        <div className="flex h-16 items-center border-b border-border px-4">
          {!collapsed && (
            <span className="text-lg font-semibold text-foreground">
              Admin
            </span>
          )}
        </div>
        <nav className="flex-1 space-y-1 p-2">
          {navItems.map(({ to, end, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  collapsed && 'justify-center px-2'
                )
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-border p-2">
          <Button
            variant="ghost"
            size="icon"
            className="w-full"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-card px-6">
          <div className="flex flex-1 items-center gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Global search"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Back to app</span>
            </Button>
          </div>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
