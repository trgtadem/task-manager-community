"use client"

import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"

interface NavbarProps {
  onLoginClick: () => void
  onSignUpClick: () => void
}

export function Navbar({ onLoginClick, onSignUpClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Users className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">CommunityHub</span>
        </div>
        <nav className="flex items-center gap-3">
          <Button variant="ghost" onClick={onLoginClick}>
            Login
          </Button>
          <Button onClick={onSignUpClick}>Sign Up</Button>
        </nav>
      </div>
    </header>
  )
}
