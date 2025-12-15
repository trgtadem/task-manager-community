# Task Manager Community Application

**Bir topluluk için modern görev yönetim sistemi** — Firebase Authentication, Firestore Database ve React/Next.js ile yapılmış.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-18+-blue?logo=react)
![Firebase](https://img.shields.io/badge/Firebase-Latest-orange?logo=firebase)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)

---

## 🎯 Özellikler

### Kimlik Doğrulama (Authentication)
- ✅ Email/Şifre ile kayıt ve giriş
- ✅ Firebase Authentication entegrasyonu
- ✅ Türkçe hata mesajları
- ✅ Browser local storage ile oturum yönetimi
- ✅ Otomatik Firestore profil oluşturma

### Kullanıcı Yönetimi
- ✅ Admin ve User rolleri
- ✅ Role-based routing (otomatik yönlendirme)
- ✅ Kullanıcı profil yönetimi
- ✅ Admin tarafından kullanıcı yönetimi

### Task/Görev Yönetimi
- ✅ Görev oluşturma, güncelleme, silme
- ✅ Görev durumu takibi (pending, in-progress, completed)
- ✅ Öncelik seviyeleri (low, medium, high)
- ✅ Admin tarafından görev atama

### Analytics & Tracking
- ✅ Google Analytics 4 (GA4) entegrasyonu
- ✅ Login, Sign-up, Logout tracking
- ✅ Task creation/completion tracking
- ✅ Error logging

### UI & UX
- ✅ Shadcn/ui + Radix UI bileşenleri
- ✅ Tailwind CSS styling
- ✅ Light/Dark mode desteği
- ✅ Responsive design

---

## 🚀 Hızlı Başlangıç

### Ön Gereksinimler
- Node.js 16+ (veya npm/pnpm)
- Firebase Console projesi
- Git

### 1. Projeyi Klonlayın
```bash
git clone https://github.com/trgtadem/task-manager-community.git
cd task-manager-community
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
# veya
pnpm install
```

### 3. Ortam Değişkenlerini Ayarlayın
`.env.local` dosyası oluşturup Firebase credentials'ınızı ekleyin:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXXXXX
```

**Firebase credentials nereden bulunur?**
1. [Firebase Console](https://console.firebase.google.com) açın
2. Project Settings → Your apps → Web uygulamanız
3. Config kopyalayın ve `.env.local`'e yapıştırın

### 4. Firebase Kurulumu
```bash
# Firebase Console'da şu adımları yapın:
# 1. Authentication → Sign-in method → Email/Password etkinleştirin
# 2. Firestore Database oluşturun (Test Mode)
# 3. Authorized Domains'e localhost:3000 ekleyin
```

### 5. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
# veya
pnpm dev
```

Tarayıcıda açın: **http://localhost:3000**

---

## 📁 Proje Yapısı

```
task-manager-community/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout (AuthProvider)
│   ├── page.tsx                 # Ana sayfa + routing
│   └── globals.css              # Global stiller
│
├── components/                  # React bileşenleri
│   ├── firebase-login.tsx       # Email/Şifre login formu
│   ├── admin-dashboard.tsx      # Admin paneli
│   ├── user-dashboard.tsx       # Kullanıcı paneli
│   ├── landing-page.tsx         # Landing page
│   └── ui/                      # Shadcn/ui components
│
├── lib/                         # Utilities & services
│   ├── firebase.ts              # Firebase SDK başlatma
│   ├── auth-context.tsx         # Global auth state (React Context)
│   ├── analytics.ts             # Google Analytics helpers
│   ├── user-service.ts          # Kullanıcı CRUD işlemleri
│   ├── task-service.ts          # Görev CRUD işlemleri
│   └── utils.ts                 # Yardımcı fonksiyonlar
│
├── public/                      # Statik dosyalar
├── styles/                      # Global stiller
├── .env.local                   # Ortam değişkenleri (git ignore)
├── .gitignore                   # Git ignore kuralları
├── package.json                 # Bağımlılıklar
├── tsconfig.json                # TypeScript config
└── README.md                    # Bu dosya
```

---

## 🔑 Ana Bileşenler

### Authentication (`lib/auth-context.tsx`)
Global auth state'i React Context ile yönetir. Tüm bileşenler `useAuth()` hook'u ile giriş bilgisine erişebilir.

```tsx
import { useAuth } from "@/lib/auth-context"

export function MyComponent() {
  const { user, userProfile, loading, logout } = useAuth()
  
  if (loading) return <div>Yükleniyor...</div>
  if (!user) return <div>Giriş yapınız</div>
  
  return <div>Hoş geldiniz {user.email}</div>
}
```

### User Service (`lib/user-service.ts`)
Firestore'da kullanıcı profili yönetimi:
- `getUserProfile(uid)` — Profil getir
- `updateUserProfile(uid, updates)` — Profil güncelle
- `makeUserAdmin(uid)` — Admin yap
- `makeUserRegular(uid)` — Normal kullanıcıya çevir

### Task Service (`lib/task-service.ts`)
Firestore'da görev yönetimi:
- `createTask(taskData)` — Görev oluştur
- `updateTask(taskId, updates)` — Görev güncelle
- `deleteTask(taskId)` — Görev sil
- `getUserTasks(userId)` — Kullanıcının görevlerini getir
- `getAllTasks()` — Tüm görevleri getir (admin)

### Analytics (`lib/analytics.ts`)
Google Analytics 4 event tracking:
- `trackLogin(userId, method)` — Giriş
- `trackSignUp(userId, method)` — Kayıt
- `trackLogout(userId)` — Çıkış
- `trackTaskCreated(taskId, priority)` — Görev oluşturma
- `trackTaskCompleted(taskId)` — Görev tamamlama
- `trackError(message, code)` — Hata logging

---

## 🛠 Geliştirme Komutları

```bash
# Geliştirme sunucusu başlat
npm run dev

# Production build
npm run build

# Production sunucu başlat
npm start

# Linter çalıştır
npm run lint
```

---

## 🔐 Güvenlik & Best Practices

### Ortam Değişkenleri
- ✅ `.env.local` dosyası `.gitignore`'da — API anahtarları korunuyor
- ✅ Tüm `NEXT_PUBLIC_*` değişkenleri istemci tarafı (public)
- ✅ Server-side secrets için `.env` dosyası kullanın (push etmeyin)

### Firestore Security Rules
Production'da şu rules kullanın:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth.uid == userId || request.auth.token.admin == true;
      allow write: if request.auth.uid == userId;
      allow create: if request.auth.uid != null;
    }
    
    match /tasks/{taskId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth.token.admin == true;
      allow delete: if request.auth.token.admin == true;
    }
  }
}
```

### Role-Based Access Control
Kritik işlemler (admin yapma, görev silme vb.) sunucu tarafında kontrol edilmeli:
```bash
# API route oluşturun: app/api/admin/promote-user/route.ts
# Firebase Admin SDK kullanın
# Firestore token doğrulayın
```

---

## 📚 Dokümantasyon

Detaylı rehberleri proje kökünde bulabilirsiniz:

- **`QUICK_START.md`** — 10 dakikalık başlangıç
- **`FIREBASE_SETUP.md`** — Firebase adım-adım kurulum
- **`AUTHENTICATION_GUIDE.md`** — Auth API referansı ve örnekler
- **`.github/copilot-instructions.md`** — Proje mimarisi (AI Agent rehberi)

---

## 🚢 Deployment

### Vercel (Recommended)
```bash
# 1. Vercel hesabınıza giriş yapın
npm i -g vercel
vercel

# 2. Vercel dashboard'da ortam değişkenlerini ekleyin
# NEXT_PUBLIC_FIREBASE_API_KEY
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
# ... (tüm NEXT_PUBLIC_* değişkenlerini)

# 3. Deploy
vercel --prod
```

### Netlify
1. GitHub repo'yu Netlify'a bağlayın
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Environment variables ekleyin
5. Deploy

### Manual Deploy (VPS/Docker)
```bash
npm run build
npm start
# PORT=3000 varsayılan
```

---

## 🤝 İşbirliği

Bu proje **açık işbirliğe hazır**!

### Branch İş Akışı
```bash
# 1. Feature branch oluştur
git checkout -b feature/your-feature-name

# 2. Değişiklik yap ve commit et
git add .
git commit -m "feat: açıklaması"

# 3. GitHub'a push et
git push origin feature/your-feature-name

# 4. Pull Request aç (GitHub Web UI)
# Açıklamasını yazın ve review bekleyin
```

### Commit Kuralları
- `feat:` — Yeni özellik
- `fix:` — Hata düzeltme
- `docs:` — Dokümantasyon
- `style:` — Formatting (kod mantığı değişmiyor)
- `refactor:` — Kod yapısı düzeltme
- `test:` — Test ekleme/güncelleme
- `chore:` — Build, dependency, vb.

Örnek: `feat: add real-time task notifications`

---

## 🐛 Sorun Giderme

### "Firebase config not found" hatası
```bash
# Çözüm: .env.local dosyası kontrol et
cat .env.local

# Tüm NEXT_PUBLIC_FIREBASE_* değişkenleri var mı?
# Sunucuyu yeniden başlat: npm run dev
```

### Giriş yapılamıyor
```bash
# 1. Firebase Console → Authentication → Email/Password açık mı?
# 2. Firestore Rules yazılmış mı?
# 3. Browser Console'da hata mesajı var mı? (F12 → Console)
```

### CORS hatası
```bash
# Firebase Console → Authentication → Authorized Domains
# Aşağıdakileri ekle:
# - localhost:3000 (geliştirme)
# - yourdomain.com (production)
```

---

## 📈 Sonraki Adımlar (Roadmap)

- [ ] Real-time Firestore listeners (onSnapshot)
- [ ] Task filtering, sorting, search
- [ ] Email notifications
- [ ] User avatar uploads (Firebase Storage)
- [ ] Google/GitHub OAuth
- [ ] Password reset flow
- [ ] Email verification
- [ ] Two-Factor Authentication (2FA)
- [ ] Advanced analytics & reporting
- [ ] Mobile app (React Native)

---

## 📞 İletişim & Destek

**Sorularınız mı var?**
1. Dokümantasyonu kontrol edin (QUICK_START.md, AUTHENTICATION_GUIDE.md)
2. GitHub Issues açın
3. Discussions sekmesine yazın

**Hata mı buldum?**
- GitHub Issues → "New Issue" → Detaylı açıklamasıyla rapor edin

---

## 📄 Lisans

Bu proje açık kaynak. Dilediğiniz gibi kullanabilirsiniz.

---

## 👥 Katkıda Bulunanlar

- **Sahip**: [trgtadem](https://github.com/trgtadem)
- **Kolaboratör**: [farukckdr](https://github.com/farukckdr)

Katkı sağlamak istiyorsanız PR açın! 🎉

---

**Son güncelleme**: 15 Aralık 2025  
**Sürüm**: 1.0.0-beta
