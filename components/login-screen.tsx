"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, User } from "lucide-react"

interface LoginScreenProps {
  onLogin: (role: "admin" | "user") => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Task Manager</CardTitle>
          <CardDescription>Select your role to continue to the dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full h-14 text-base" onClick={() => onLogin("admin")}>
            <Shield className="mr-2 h-5 w-5" />
            Login as Admin
          </Button>
          <Button variant="outline" className="w-full h-14 text-base bg-transparent" onClick={() => onLogin("user")}>
            <User className="mr-2 h-5 w-5" />
            Login as User
          </Button>
          <p className="text-center text-xs text-muted-foreground pt-2">
            This is a demo. Select a role to explore the interface.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
