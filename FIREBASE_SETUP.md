# Firebase Kurulum Rehberi

## 1. Firebase Projesi Oluşturma

1. [Firebase Console](https://console.firebase.google.com) adresine gidin
2. "Yeni Proje Oluştur" butonuna tıklayın
3. Proje adını girin (örn: "task-manager-community")
4. Gerekli kuralları kabul edin ve projeyi oluşturun
5. Web uygulaması ekleyin (</> simgesi)

## 2. Firebase Kimlik Doğrulaması (Authentication) Ayarlama

### Email/Şifre Yöntemi Etkinleştirme

1. Firebase Console'da **Authentication** sekmesine gidin
2. **Sign-in method** (Oturum açma yöntemi) sekmesine tıklayın
3. **Email/Password** yöntemi üzerinde tıklayın
4. **Email/Password** seçeneğini açın ve **Kaydet**e tıklayın
5. İsteğe bağlı: **Email link (passwordless sign-in)** özelliğini de açabilirsiniz

### CORS Ayarları (Gerekirse)

1. Eğer başka bir domaindle test ediyorsanız, Authentication → Settings → Authorized domains kısmında domaininizi ekleyin

## 3. Firestore Database Oluşturma

1. Firebase Console'da **Firestore Database** sekmesine gidin
2. **Create Database** (Veri Tabanı Oluştur) butonuna tıklayın
3. Başlangıç modu seçimi:
   - **Test Mode**: Geliştirme için (tüm okuma/yazma izni)
   - **Production Mode**: Üretim için (Firestore rules dosyasından kontrol)
4. Bölgenizi seçin (en yakın bölge öneriliyor)
5. **Oluştur**e tıklayın

## 4. Firebase Yapılandırması Alma

1. Firebase Console'da **Project Settings** (Proje Ayarları)
2. **Your apps** (Uygulamalarınız) bölümünde web uygulamanız
3. Config kopyalayın ve `.env.local` dosyasına yapıştırın

Örnek:
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyA...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=task-manager-123.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=task-manager-123
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=task-manager-123.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123def456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXXXXX
```

### Measurement ID'sini Nerede Bulacaksınız?

1. Firebase Console → **Project Settings** (Proje Ayarları)
2. **Integrations** (Entegrasyonlar) sekmesi
3. **Google Analytics** kartını bulun
4. **Measurement ID** (Google Analytics 4) kopyalayın
5. `.env.local`'deki `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` değişkenine yapıştırın

**NOT:** Google Analytics küçük hesaplarda standart olarak etkin olabilir. Eğer entegrasyon sekmesinde görünmüyorsa, Project Settings'in genel sekmesinde de arayabilirsiniz.

## 5. Firestore Kuralları Ayarlama (Security Rules)

Firebase Console → Firestore Database → Rules sekmesinde aşağıdaki kuralları yazın:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Tüm oturum açmış kullanıcılar kendi profillerini okuyabilir ve yazabilir
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId;
      allow create: if request.auth.uid != null;
    }

    // Admin kullanıcılar tüm task'ları görebilir
    match /tasks/{taskId} {
      allow read: if request.auth != null;
      allow write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow create: if request.auth != null;
    }
  }
}
```

## 6. Sunucu Tarafı Operasyonlar İçin Hizmet Hesabı (İsteğe bağlı)

Node.js ile sunucu tarafında Firebase Admin SDK kullanmak istiyorsanız:

```bash
npm install firebase-admin
```

Firebase Console → Project Settings → Service Accounts sekmesinden private key dosyasını indirin.

## 7. Test Etme

1. Uygulamayı çalıştırın:
```bash
npm run dev
```

2. `http://localhost:3000` adresine gidin
3. "Yeni hesap oluştur" butonuna tıklayın
4. Test email ve şifre ile kayıt olun
5. Firebase Console'da Authentication → Users sekmesinde kullanıcıyı görebilirsiniz

## Sorun Giderme

### "Firebase config not found" hatası
- `.env.local` dosyasının projenin kök dizininde olduğundan emin olun
- Tüm ortam değişkenlerini doğru kopyaladığınızı kontrol edin
- Sunucuyu yeniden başlatın: `npm run dev`

### Giriş yapılamıyor
- Authentication → Sign-in method → Email/Password etkin mi?
- Firestore Rules doğru mu ayarlanmış?
- Browser konsolu hata mesajlarını kontrol edin

### CORS hatası
- Authentication → Settings → Authorized domains'e localhost:3000 ekleyin
- Production'da ürün domaininizi ekleyin

## Sonraki Adımlar

- [ ] Admin kullanıcısı tanımlaması (Admin SDK veya Console)
- [ ] Kullanıcı rolleri (admin/user) uygulaması
- [ ] Task yönetimi Firestore'a taşıma
- [ ] Real-time güncelleme (Firestore listeners)
- [ ] Kullanıcı verilerinin şifrelenip korunması
