"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, LogOut, Rocket, Target } from "lucide-react"
import type { User } from "@/app/page"

interface UserDashboardProps {
  user: User
  onLogout: () => void
  onBack?: () => void
}

export function UserDashboard({ user, onLogout, onBack }: UserDashboardProps) {
  const firstName = user.email.split("@")[0]

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Rocket className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">My Dashboard</h1>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack}>
                Geri
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-4xl p-4">
        {/* Hero Section */}
        <div className="mb-8 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 sm:p-8">
          <h2 className="text-2xl font-bold sm:text-3xl">Welcome back, {firstName}! 👋</h2>
          <p className="mt-2 text-muted-foreground">Here&apos;s your current mission status</p>
        </div>

        {/* Mission Card */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-muted/30">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <CardTitle>Current Mission</CardTitle>
            </div>
            <CardDescription>Your assigned task from the admin</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {user.currentTask ? (
              <div className="space-y-4">
                <div className="flex items-start gap-3 rounded-lg bg-emerald-500/10 p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500">
                    <Target className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-emerald-700 dark:text-emerald-400">Active Task</p>
                    <p className="mt-1 text-lg">{user.currentTask}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Complete this task and check back for your next mission.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Clock className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">Waiting for instructions...</h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  No task has been assigned yet. Your admin will assign you a mission soon.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
