"use client"

import { useState } from "react"
import { auth } from "@/lib/firebase"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth"
import { trackSignUp, trackLogin, trackError } from "@/lib/analytics"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface FirebaseLoginProps {
  onLoginSuccess?: () => void
}

export function FirebaseLogin({ onLoginSuccess }: FirebaseLoginProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Browser local persistence'ını ayarla
      await setPersistence(auth, browserLocalPersistence)

      if (isSignUp) {
        // Yeni hesap oluştur
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        )
        console.log("Hesap oluşturuldu:", userCredential.user.email)
        // Analytics'e track et
        trackSignUp(userCredential.user.uid, "email")
      } else {
        // Mevcut hesapla giriş yap
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        )
        console.log("Giriş yapıldı:", userCredential.user.email)
        // Analytics'e track et
        trackLogin(userCredential.user.uid, "email")
      }

      // Başarılı giriş sonrası
      onLoginSuccess?.()
      router.push("/dashboard")
    } catch (err: any) {
      // Firebase hata mesajlarını Türkçeleştir
      const errorCode = err.code
      let errorMessage = "Bir hata oluştu. Lütfen tekrar deneyin."

      if (errorCode === "auth/email-already-in-use") {
        errorMessage = "Bu email zaten kullanımda."
      } else if (errorCode === "auth/invalid-email") {
        errorMessage = "Geçersiz email adresi."
      } else if (errorCode === "auth/weak-password") {
        errorMessage = "Şifre çok zayıf. En az 6 karakter olmalı."
      } else if (errorCode === "auth/user-not-found") {
        errorMessage = "Bu email ile kayıtlı kullanıcı bulunamadı."
      } else if (errorCode === "auth/wrong-password") {
        errorMessage = "Şifre yanlış."
      } else if (errorCode === "auth/invalid-credential") {
        errorMessage = "Email veya şifre hatalı."
      }

      // Hata tracking
      trackError(errorMessage, errorCode)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Task Manager</CardTitle>
          <CardDescription>
            {isSignUp ? "Yeni hesap oluştur" : "Hesabınıza giriş yapın"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Adresi</Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading
                ? "İşlem yapılıyor..."
                : isSignUp
                  ? "Hesap Oluştur"
                  : "Giriş Yap"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-2 text-muted-foreground">
                veya
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError(null)
            }}
            disabled={loading}
          >
            {isSignUp ? "Zaten hesabım var" : "Yeni hesap oluştur"}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Giriş yaparak{" "}
            <a href="#" className="underline hover:text-foreground">
              Hüküm ve Koşulları
            </a>{" "}
            kabul ediyorsunuz.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
