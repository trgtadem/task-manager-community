"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CheckCircle2, Clock, Send, Trash2 } from "lucide-react"
import type { User } from "@/app/page"

interface UserCardProps {
  user: User
  onDelete: (userId: string) => void
  onAssignTask: (userId: string, task: string) => void
}

export function UserCard({ user, onDelete, onAssignTask }: UserCardProps) {
  const [taskInput, setTaskInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (taskInput.trim()) {
      onAssignTask(user.id, taskInput.trim())
      setTaskInput("")
    }
  }

  const initials = user.email.split("@")[0].slice(0, 2).toUpperCase()

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{user.email}</p>
              <div className="flex items-center gap-1.5 text-xs">
                {user.currentTask ? (
                  <>
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    <span className="text-emerald-600">Has active task</span>
                  </>
                ) : (
                  <>
                    <Clock className="h-3 w-3 text-amber-500" />
                    <span className="text-amber-600">Waiting</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onDelete(user.id)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete user</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Current Task Display */}
        <div className="rounded-md bg-muted/50 p-3">
          <p className="mb-1 text-xs font-medium text-muted-foreground">Current Task</p>
          <p className="text-sm">
            {user.currentTask || <span className="italic text-muted-foreground">No task assigned</span>}
          </p>
        </div>

        {/* Assign Task Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="text"
            placeholder="Assign new task..."
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            className="h-9 text-sm"
          />
          <Button type="submit" size="sm" className="h-9 px-3">
            <Send className="h-4 w-4" />
            <span className="sr-only">Assign task</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
