# Firebase Authentication Entegrasyon Rehberi

## 📋 İçindekiler
1. [Kurulum](#kurulum)
2. [Dosya Yapısı](#dosya-yapısı)
3. [Kullanım Örnekleri](#kullanım-örnekleri)
4. [API Referansı](#api-referansı)
5. [Sorun Giderme](#sorun-giderme)

---

## Kurulum

### 1. Firebase Projesi Hazırlığı

```bash
# Paketleri yükle
npm install

# Dev sunucusunu başlat
npm run dev
```

### 2. Firebase Konfigürasyonu

`.env.local` dosyasını aşağıdaki bilgilerle doldurun:

```bash
# Firebase Console'dan kopyalanan config:
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXXXXX
```

### 3. Firebase Console Ayarları

**Authentication (Giriş Yöntemi):**
- Email/Password etkinleştirin
- Authorized Domains'e localhost:3000 ekleyin

**Firestore Database:**
- Test Mode ile başlayın
- Aşağıdaki Security Rules'u yazın:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth.uid == userId || request.auth.token.admin == true;
      allow write: if request.auth.uid == userId;
      allow create: if request.auth.uid != null;
    }

    // Tasks collection
    match /tasks/{taskId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth.uid == resource.data.createdBy || request.auth.token.admin == true;
      allow delete: if request.auth.token.admin == true;
    }
  }
}
```

---

## Dosya Yapısı

```
lib/
├── firebase.ts               # Firebase SDK başlatması
├── auth-context.tsx          # Global Auth state (React Context)
├── user-service.ts           # Kullanıcı işlemleri
└── task-service.ts           # Task (görev) işlemleri

components/
├── firebase-login.tsx        # Email/Şifre login formu
└── ui/
    └── [UI components]       # Shadcn/ui bileşenleri

app/
├── layout.tsx                # Root layout (AuthProvider)
└── page.tsx                  # Ana sayfa (login durumuna göre)
```

---

## Kullanım Örnekleri

### 1. Giriş Yapmış Kullanıcı Bilgilerini Almak

```tsx
"use client"

import { useAuth } from "@/lib/auth-context"

export function UserGreeting() {
  const { user, userProfile, loading } = useAuth()

  if (loading) return <div>Yükleniyor...</div>
  if (!user) return <div>Lütfen giriş yapın</div>

  return (
    <div>
      <h1>Hoş geldiniz, {user.email}</h1>
      <p>Rol: {userProfile?.role}</p>
    </div>
  )
}
```

### 2. Çıkış Yapma

```tsx
import { useAuth } from "@/lib/auth-context"

export function LogoutButton() {
  const { logout } = useAuth()

  return (
    <button onClick={logout}>
      Çıkış Yap
    </button>
  )
}
```

### 3. Task Oluşturmak

```tsx
import { createTask } from "@/lib/task-service"
import { useAuth } from "@/lib/auth-context"

export function CreateTaskForm() {
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const taskId = await createTask({
      title: "Yeni Görev",
      description: "Görev açıklaması",
      assignedTo: user!.uid,
      status: "pending",
      priority: "high",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 gün sonra
    })

    if (taskId) {
      console.log("Task oluşturuldu:", taskId)
    }
  }

  return <form onSubmit={handleSubmit}>{/* Form fields */}</form>
}
```

### 4. Kullanıcı Profilini Güncellemek

```tsx
import { updateUserProfile } from "@/lib/user-service"
import { useAuth } from "@/lib/auth-context"

export function UpdateProfile() {
  const { user } = useAuth()

  const handleUpdate = async () => {
    const success = await updateUserProfile(user!.uid, {
      displayName: "Yeni Adı",
      updatedAt: new Date(),
    })

    if (success) {
      console.log("Profil güncellendi")
    }
  }

  return <form onSubmit={handleSubmit}>{/* Form fields */}</form>
}
```

### 4. Kullanıcı Profilini Güncellemek

```tsx
import { updateUserProfile } from "@/lib/user-service"
import { useAuth } from "@/lib/auth-context"

export function UpdateProfile() {
  const { user } = useAuth()

  const handleUpdate = async () => {
    const success = await updateUserProfile(user!.uid, {
      displayName: "Yeni Adı",
      updatedAt: new Date(),
    })

    if (success) {
      console.log("Profil güncellendi")
    }
  }

  return <button onClick={handleUpdate}>Profili Güncelle</button>
}
```

### 5. Analytics Tracking

```tsx
import { trackTaskCreated, trackTaskCompleted } from "@/lib/analytics"

// Task oluşturduktan sonra track et
const taskId = await createTask(taskData)
if (taskId) {
  trackTaskCreated(taskId, "high")
}

// Task tamamlandıktan sonra track et
await updateTask(taskId, { status: "completed" })
trackTaskCompleted(taskId)
```

---

## API Referansı

### Auth Context - `useAuth()`

```tsx
const {
  user,          // FirebaseUser | null
  userProfile,   // UserProfile | null
  loading,       // boolean
  logout,        // () => Promise<void>
} = useAuth()
```

### User Service

#### `getUserProfile(uid: string): Promise<UserProfile | null>`
Belirli bir kullanıcının profilini al.

#### `updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<boolean>`
Kullanıcı profilini güncelle.

#### `makeUserAdmin(uid: string): Promise<boolean>`
Kullanıcıyı admin yap.

#### `makeUserRegular(uid: string): Promise<boolean>`
Kullanıcıyı normal kullanıcıya çevir.

### Task Service

#### `createTask(taskData: Omit<Task, ...>): Promise<string | null>`
Yeni task oluştur, task ID'sini döndür.

#### `updateTask(taskId: string, updates: Partial<Task>): Promise<boolean>`
Belirli bir task'ı güncelle.

#### `deleteTask(taskId: string): Promise<boolean>`
Task'ı sil.

#### `getUserTasks(userId: string): Promise<Task[]>`
Belirli kullanıcıya atanan tüm task'ları al.

#### `getAllTasks(): Promise<Task[]>`
Tüm task'ları al (admin için).

### Analytics Service

#### `trackEvent(eventName: string, eventParams?: Record<string, any>): void`
Firebase Analytics'e custom event gönder.

#### `trackLogin(userId: string, method?: string): void`
Kullanıcı girişini track et.

#### `trackSignUp(userId: string, method?: string): void`
Kullanıcı kaydını track et.

#### `trackLogout(userId: string): void`
Çıkışı track et.

#### `trackTaskCreated(taskId: string, priority: string): void`
Task oluşturmayı track et.

#### `trackTaskCompleted(taskId: string): void`
Task tamamlanmasını track et.

#### `trackPageView(pageName: string): void`
Sayfa görüntülenmesini track et.

#### `trackError(errorMessage: string, errorCode?: string): void`
Hata logging.

---

## Sorun Giderme

### ❌ "Firebase config not found" hatası

**Çözüm:**
1. `.env.local` dosyası mevcut mu kontrol edin
2. Tüm `NEXT_PUBLIC_` başlayan değişkenleri doldurun
3. Sunucuyu yeniden başlatın: `npm run dev`

### ❌ Giriş yapılamıyor

**Kontrol Listesi:**
- [ ] Firebase Console → Authentication → Email/Password açık mı?
- [ ] `.env.local` dosyasındaki credentials doğru mu?
- [ ] Firestore Rules yazılmış mı?
- [ ] Tarayıcı Developer Tools → Console'da hata var mı?

### ❌ "CORS error" hatası

**Çözüm:**
1. Firebase Console → Project Settings → Authentication
2. Authorized Domains'e aşağıdakileri ekleyin:
   - Geliştirme: `localhost:3000`
   - Production: `yourdomain.com`

### ❌ Task'ları kaydedemiyor

**Çözüm:**
1. Firebase Console → Firestore Database → Rules kontrol edin
2. `tasks` collection'ı var mı?
3. Rules'de `allow write` var mı?

### ❌ Profil "undefined" gösteriliyor

**Çözüm:**
1. Firestore'da `users` collection oluşturuldu mu?
2. Rules'de `allow write: if request.auth.uid == userId;` var mı?
3. Giriş yapmış kullanıcının belgeği var mı?

---

## Ortamlar

### Development
```bash
npm run dev
```
- Localhost:3000
- Test Mode Firestore kuralları
- Email verification devre dışı

### Production
```bash
npm run build
npm run start
```
- Gerçek domain
- Security Rules etkin
- Email verification etkin
- Enhanced security measures

---

## Best Practices

### 1. Gizlilik ve Güvenlik
```tsx
// ✅ Doğru
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY

// ❌ Yanlış - sadece client tarafında çalışır
const secretKey = process.env.FIREBASE_SECRET_KEY
```

### 2. Error Handling
```tsx
try {
  const task = await createTask(taskData)
  if (!task) {
    console.error("Task oluşturma başarısız")
  }
} catch (error) {
  console.error("Beklenmeyen hata:", error)
}
```

### 3. Loading States
```tsx
const { loading } = useAuth()
if (loading) return <LoadingSpinner />
```

### 4. Cleanup
```tsx
useEffect(() => {
  // Unsubscribe function
  return () => {
    // Cleanup
  }
}, [])
```

---

## Kaynaklar

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Auth REST API](https://firebase.google.com/docs/reference/rest/auth)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Next.js Authentication](https://nextjs.org/docs/authentication)

---

## İletişim ve Destek

Sorun veya soru için:
1. Tarayıcı Console'ı kontrol edin
2. Firebase Admin SDK logs'unu inceleyin
3. GitHub Issues veya Discussions açın
