import { type ReactNode } from 'react'

export type AdminPermission = 'view' | 'manage' | 'billing' | 'logs' | 'settings'

interface AdminGuardProps {
  /** Permissions required (user must have at least one). If empty, always render. */
  permissions: AdminPermission[]
  /** Current user's permissions (e.g. from auth context). */
  userPermissions: AdminPermission[]
  /** Optional: hide content entirely when unauthorized. Default true. */
  hideWhenUnauthorized?: boolean
  children: ReactNode
  /** Optional fallback when unauthorized. */
  fallback?: ReactNode
}

/**
 * RBAC guard: renders children only when user has at least one of the required permissions.
 * Use for admin sections (Users, Quotas, Billing, Logs, Settings).
 */
export function AdminGuard({
  permissions,
  userPermissions,
  hideWhenUnauthorized = true,
  children,
  fallback = null,
}: AdminGuardProps) {
  const hasPermission =
    permissions.length === 0 ||
    permissions.some((p) => userPermissions.includes(p))
  if (!hasPermission) return <>{hideWhenUnauthorized ? fallback : null}</>
  return <>{children}</>
}
