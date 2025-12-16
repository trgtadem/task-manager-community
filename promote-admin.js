const admin = require('firebase-admin');
const path = require('path');

// Service Account Key'i yükle
const serviceAccount = require(path.join(__dirname, 'serviceAccountKey.json'));

// Firebase Admin SDK'yı başlat
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function makeAdmin(uid) {
  try {
    console.log(`Admin yetkisi atanıyor: ${uid}`);
    
    // Custom claim ekle
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    console.log(`✅ Kullanıcı ${uid} artık admin yetkisine sahip.`);
    
    // Mevcut token'ı iptal et (kullanıcı yeniden giriş yapmalı)
    await admin.auth().revokeRefreshTokens(uid);
    console.log(`✅ Kullanıcının ${uid} belirteci iptal edildi. Yeniden giriş yapması gerekiyor.`);
  } catch (error) {
    console.error('❌ Admin yetkisi atanırken hata oluştu:', error.message);
  }
}

// UID'yi argüman olarak al veya sabit kullan
const targetUid = process.argv[2] || 'UIX0nu8Mw0Yfo1CjTN8mFzP5rkx2';
makeAdmin(targetUid);
