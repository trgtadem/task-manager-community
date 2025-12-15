# 🚀 Firebase Authentication - Hızlı Başlangıç

**Zaman:** 10 dakika  
**Seviye:** Başlangıç

## 1️⃣ Firebase Projesi Oluşturma (2 dakika)

1. https://console.firebase.google.com adresine gidin
2. **Yeni Proje Oluştur** butonuna tıklayın
3. Proje adını girin (örn: "task-manager")
4. **Oluştur**e tıklayın

## 2️⃣ Web Uygulaması Ekleme (1 dakika)

1. Firebase Console'da **Proje Ayarları** → **Uygulamalarınız**
2. **Web uygulaması ekle** (</> simgesi)
3. Uygulama adını girin
4. **Uygulamayı kaydet**e tıklayın
5. **Config'i kopyalayın** (konsolda gösterilecek)

## 3️⃣ Ortam Değişkenlerini Ayarlama (2 dakika)

**`.env.local` dosyasını aç ve doldur:**

```bash
# Firebase Console'dan kopyalanan config:
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXX
```

**💡 Measurement ID'sini nereden bulursunuz?**
- Firebase Console → Project Settings → Integrations → Google Analytics
- Veya Project Settings → General sekmesinde

## 4️⃣ Authentication Etkinleştirme (2 dakika)

Firebase Console'da:

1. **Authentication** sekmesi
2. **Oturum açma yöntemi**
3. **Email/Password** üzerinde tıkla
4. **Email/Password** aç → **Kaydet**
5. **Authorized Domains** sekmesi
6. `localhost:3000` ekle

## 5️⃣ Firestore Oluşturma (2 dakika)

Firebase Console'da:

1. **Firestore Database**
2. **Veri tabanı oluştur**
3. **Test Mode** seç (geliştirme için)
4. Bölgeni seç
5. **Oluştur**

### Security Rules (İsteğe Bağlı)

Firestore → Rules sekmesi:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId;
      allow create: if request.auth.uid != null;
    }
    match /tasks/{taskId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

## 6️⃣ Uygulamayı Test Etme (1 dakika)

```bash
# Terminal'de (eğer çalışmıyorsa):
npm run dev

# Tarayıcı:
http://localhost:3000
```

**Test Adımları:**
1. "Yeni hesap oluştur" tıkla
2. Email: `test@example.com`
3. Şifre: `Test123456`
4. "Hesap Oluştur"
5. Firebase Console → Authentication → Users sekmesinde göreceksin
6. Panele giriş yaparsın ✅

## ✅ Başarı!

Firebaes Authentication başarıyla entegre edildi!

- ✅ Giriş sistemi çalışıyor
- ✅ Kullanıcılar Firestore'a kaydediliyor
- ✅ Role-based routing aktif
- ✅ Admin/User panelleri hazır

## 📚 Daha Fazla Bilgi

- **Detaylı Rehber:** `AUTHENTICATION_GUIDE.md`
- **Proje Dokümantasyonu:** `.github/copilot-instructions.md`
- **Setup Kontrol:** `SETUP_COMPLETE.md`

## 💬 İhtiyacın Olur mu?

**Giriş Problem:**
1. `.env.local` kontrolü yapın
2. Firebase Console → Authentication → Email/Password açık mı?
3. Tarayıcı Console'unda hata mesajını okuyun

**Task Ekle:**
1. Admin panele gir
2. Kullanıcılara task ata
3. Firestore'da tasks collection'ı oluşturulacak

---

**İyi çalışmalar!** 🎉
