"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { LandingPage } from "@/components/landing-page"
import { FirebaseLogin } from "@/components/firebase-login"
import { AdminDashboard } from "@/components/admin-dashboard"
import { UserDashboard } from "@/components/user-dashboard"

// Mock user data - will be replaced with Firebase Firestore later
export interface User {
  id: string
  email: string
  currentTask: string | null
}

const initialUsers: User[] = [
  { id: "1", email: "john@example.com", currentTask: "Complete the quarterly report" },
  { id: "2", email: "sarah@example.com", currentTask: null },
  { id: "3", email: "mike@example.com", currentTask: "Review pull requests" },
  { id: "4", email: "emma@example.com", currentTask: "Update documentation" },
]

export type ViewType = "landing" | "login" | "admin" | "user" | "loading"

export default function TaskManagementApp() {
  const { user, userProfile, loading: authLoading, logout } = useAuth()
  const [currentView, setCurrentView] = useState<ViewType>("loading")
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  // Auth durumunu kontrol et ve view'ı güncelle
  useEffect(() => {
    if (authLoading) {
      setCurrentView("loading")
    } else if (user) {
      // Kullanıcı giriş yapmış
      if (userProfile?.role === "admin") {
        setCurrentView("admin")
      } else {
        setCurrentView("user")
        // Kullanıcı bilgisini ayarla
        setCurrentUser({
          id: user.uid,
          email: user.email || "Bilinmiyor",
          currentTask: null,
        })
      }
    } else {
      // Kullanıcı giriş yapmamış
      setCurrentView("landing")
    }
  }, [user, userProfile, authLoading])

  const handleGoToLogin = () => {
    // Eğer zaten giriş yapılmışsa doğrudan uygun dashboard'a yönlendir
    if (user) {
      if (userProfile?.role === "admin") setCurrentView("admin")
      else setCurrentView("user")
    } else {
      setCurrentView("login")
    }
  }

  const handleLogout = async () => {
    await logout()
    setCurrentView("landing")
    setCurrentUser(null)
  }

  const handleDeleteUser = (userId: string) => {
    // TODO: Replace with Firebase Firestore delete
    setUsers((prev) => prev.filter((user) => user.id !== userId))
  }

  const handleAssignTask = (userId: string, task: string) => {
    // TODO: Replace with Firebase Firestore update
    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, currentTask: task } : user)))
    // Update current user if they received a task
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, currentTask: task } : null))
    }
  }

  // Loading state
  if (currentView === "loading") {
    return (
      <main className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {currentView === "landing" && <LandingPage onLoginClick={handleGoToLogin} onSignUpClick={handleGoToLogin} />}
      {currentView === "login" && (
        <FirebaseLogin
          onLoginSuccess={() => {
            // Giriş başarılıysa view'ı user olarak ayarla (auth listener da yardımı olacak)
            setCurrentView("user")
          }}
        />
      )}
      {currentView === "admin" && (
        <AdminDashboard
          users={users}
          onDeleteUser={handleDeleteUser}
          onAssignTask={handleAssignTask}
          onLogout={handleLogout}
        />
      )}
      {currentView === "user" && currentUser && (
        <UserDashboard
          user={currentUser}
          onLogout={handleLogout}
          onBack={() => setCurrentView("landing")}
        />
      )}
    </main>
  )
}
