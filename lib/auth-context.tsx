"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { auth, db } from "@/lib/firebase"
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signOut,
} from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { trackLogout } from "@/lib/analytics"

export interface UserProfile {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  role: "admin" | "user"
  createdAt: Date
  updatedAt: Date
}

interface AuthContextType {
  user: FirebaseUser | null
  userProfile: UserProfile | null
  loading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  logout: async () => {},
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth hook'u AuthProvider içinde kullanılmalı")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Firebase auth state değişikliklerini dinle
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)

        // Firestore'dan kullanıcı profilini al
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid)
          const userDoc = await getDoc(userDocRef)

          if (userDoc.exists()) {
            const userData = userDoc.data() as UserProfile
            setUserProfile(userData)
          } else {
            // İlk kez giriş yapan kullanıcı, yeni profil oluştur
            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              role: "user", // Varsayılan olarak user
              createdAt: new Date(),
              updatedAt: new Date(),
            }
            await setDoc(doc(db, "users", firebaseUser.uid), newProfile)
            setUserProfile(newProfile)
          }
        } catch (error) {
          console.error("Profil yükleme hatası:", error)
        }
      } else {
        setUser(null)
        setUserProfile(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const logout = async () => {
    if (user) {
      // Analytics'e track et
      trackLogout(user.uid)
    }
    await signOut(auth)
  }

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
