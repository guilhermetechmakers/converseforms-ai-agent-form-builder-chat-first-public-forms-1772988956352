import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, Search, Key, UserCog, UserX, UserCheck } from 'lucide-react'
import { useAdminUsers, useAdminResetPassword, useAdminImpersonate, useUpdateAdminUser } from '@/hooks/useAdmin'
import type { AdminUser } from '@/types/admin'
import { AnimatedPage } from '@/components/AnimatedPage'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

export function UsersManagement() {
  const { data: users = [], isLoading } = useAdminUsers()
  const [search, setSearch] = useState('')
  const resetPassword = useAdminResetPassword()
  const impersonate = useAdminImpersonate()
  const updateUser = useUpdateAdminUser()

  const filtered = useMemo(() => {
    const list = Array.isArray(users) ? users : []
    if (!search.trim()) return list
    const q = search.toLowerCase()
    return list.filter(
      (u) =>
        u.email?.toLowerCase().includes(q) ||
        u.name?.toLowerCase().includes(q) ||
        u.role?.toLowerCase().includes(q)
    )
  }, [users, search])

  const handleResetPassword = (u: AdminUser) => resetPassword.mutate(u.id)
  const handleImpersonate = (u: AdminUser) => impersonate.mutate(u.id)
  const handleToggleStatus = (u: AdminUser) =>
    updateUser.mutate({
      id: u.id,
      updates: { status: u.status === 'active' ? 'inactive' : 'active' },
    })

  return (
    <AnimatedPage className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Users</h1>
        <p className="text-muted-foreground">Manage users, roles, and access.</p>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>All users</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-8 w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm">
              Bulk actions
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-64 items-center justify-center text-muted-foreground">
              Loading...
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border text-muted-foreground">
              <p>No users found.</p>
            </div>
          ) : (
            <div className="overflow-auto rounded-md border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last login</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.name ?? '—'}</TableCell>
                      <TableCell>{u.email ?? '—'}</TableCell>
                      <TableCell>{u.role ?? '—'}</TableCell>
                      <TableCell>{u.orgId ?? '—'}</TableCell>
                      <TableCell>
                        <Badge
                          variant={u.status === 'active' ? 'default' : 'secondary'}
                          className={cn(
                            u.status === 'active' && 'bg-[rgb(var(--success))] text-white'
                          )}
                        >
                          {u.status ?? '—'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {u.lastLogin
                          ? formatDistanceToNow(new Date(u.lastLogin), { addSuffix: true })
                          : '—'}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleResetPassword(u)}>
                              <Key className="mr-2 h-4 w-4" />
                              Reset password
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleImpersonate(u)}>
                              <UserCog className="mr-2 h-4 w-4" />
                              Impersonate
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleStatus(u)}>
                              {u.status === 'active' ? (
                                <>
                                  <UserX className="mr-2 h-4 w-4" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </AnimatedPage>
  )
}
