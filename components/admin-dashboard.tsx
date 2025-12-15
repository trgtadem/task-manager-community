"use client"

import { Button } from "@/components/ui/button"
import { UserCard } from "@/components/user-card"
import { LogOut, Users } from "lucide-react"
import type { User } from "@/app/page"

interface AdminDashboardProps {
  users: User[]
  onDeleteUser: (userId: string) => void
  onAssignTask: (userId: string, task: string) => void
  onLogout: () => void
}

export function AdminDashboard({ users, onDeleteUser, onAssignTask, onLogout }: AdminDashboardProps) {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Users className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground">Manage users and assign tasks</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-6xl p-4">
        {/* Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Users</p>
            <p className="text-2xl font-bold">{users.length}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Active Tasks</p>
            <p className="text-2xl font-bold">{users.filter((u) => u.currentTask).length}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Waiting</p>
            <p className="text-2xl font-bold">{users.filter((u) => !u.currentTask).length}</p>
          </div>
        </div>

        {/* Users Grid */}
        <h2 className="mb-4 text-lg font-semibold">Registered Users</h2>
        {users.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-2 text-muted-foreground">No users registered yet</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {users.map((user) => (
              <UserCard key={user.id} user={user} onDelete={onDeleteUser} onAssignTask={onAssignTask} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
