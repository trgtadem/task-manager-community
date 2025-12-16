"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { auth, db } from "@/lib/firebase"
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signOut,
} from "firebase/auth"
import { doc, getDoc, setDoc, getDocFromCache } from "firebase/firestore"
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

        // Firestore'dan kullanıcı profilini al (offline toleranslı)
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid)

          // Eğer tarayıcıdayız ve çevrimdışıysak, önce önbellekten dene
          if (typeof window !== "undefined" && !navigator.onLine) {
            try {
              const cachedDoc = await getDocFromCache(userDocRef)
              if (cachedDoc && cachedDoc.exists()) {
                const userData = cachedDoc.data() as UserProfile
                setUserProfile(userData)
                console.info("Kullanıcı profili önbellekten yüklendi:", firebaseUser.uid)
              } else {
                // Önbellekte yoksa lokal fallback oluştur (yazmayı ertele)
                const now = new Date()
                const localProfile: UserProfile = {
                  uid: firebaseUser.uid,
                  email: firebaseUser.email,
                  displayName: firebaseUser.displayName,
                  photoURL: firebaseUser.photoURL,
                  role: "user",
                  createdAt: now,
                  updatedAt: now,
                }
                setUserProfile(localProfile)
                console.warn(
                  "Çevrimdışı: önbellekte kullanıcı dökümanı yok. Yerel profil kullanılıyor; ağ geri geldiğinde Firestore'a yazılacak.",
                  firebaseUser.uid
                )

                if (typeof window !== "undefined") {
                  const handleOnline = async () => {
                    try {
                      await setDoc(userDocRef, localProfile)
                      console.info(
                        "Çevrimdışı oluşturulan yerel profil Firestore'a yazıldı:",
                        firebaseUser.uid
                      )
                    } catch (writeErr) {
                      console.error(
                        "Yerel profil Firestore'a yazılamadı (çevrimdışı sonrası):",
                        writeErr
                      )
                    }
                  }
                  window.addEventListener("online", handleOnline, { once: true })
                }
              }
            } catch (cacheErr) {
              // getDocFromCache hata atabilir (ör. önbellek yok)
              console.warn("Önbellekten okuma başarısız, lokal profil oluşturuluyor:", cacheErr)
              const now = new Date()
              const localProfile: UserProfile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
                role: "user",
                createdAt: now,
                updatedAt: now,
              }
              setUserProfile(localProfile)
              if (typeof window !== "undefined") {
                const handleOnline = async () => {
                  try {
                    await setDoc(userDocRef, localProfile)
                    console.info("Lokal profil çevrimdışı sonrası Firestore'a yazıldı:", firebaseUser.uid)
                  } catch (writeErr) {
                    console.error("Çevrimdışı sonrası yazma hatası:", writeErr)
                  }
                }
                window.addEventListener("online", handleOnline, { once: true })
              }
            }
          } else {
            // Online veya server-side: normal akış
            const userDoc = await getDoc(userDocRef)
            if (userDoc.exists()) {
              const userData = userDoc.data() as UserProfile
              setUserProfile(userData)
            } else {
              const newProfile: UserProfile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
                role: "user",
                createdAt: new Date(),
                updatedAt: new Date(),
              }
              await setDoc(userDocRef, newProfile)
              setUserProfile(newProfile)
            }
          }
        } catch (error) {
          console.error("Kullanıcı profil işlemi sırasında hata oluştu:", error)
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
