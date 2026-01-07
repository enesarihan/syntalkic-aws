# 🔧 EC2 Firebase Auth Sorun Giderme

## Sorun: EC2'de Giriş Yapma İşlemleri Çalışmıyor

EC2'de Firebase Authentication çalışmıyorsa, aşağıdaki kontrolleri yapın.

---

## ✅ Kontrol Listesi

### 1. Firebase Console - Authorized Domains

1. Firebase Console'a gidin: https://console.firebase.google.com
2. Projenizi seçin
3. **Authentication** > **Settings** > **Authorized domains**
4. Şu domain'leri ekleyin:
   - `EC2-IP-ADRESI` (örn: `54.123.45.67`)
   - `http://EC2-IP-ADRESI:3000` (eğer port 3000 kullanıyorsanız)
   - Domain adınız varsa: `yourdomain.com`

**ÖNEMLİ:** IP adresini eklediyseniz, format şöyle olmalı:
- ✅ `54.123.45.67` (sadece IP)
- ❌ `http://54.123.45.67` (protocol olmadan)
- ❌ `54.123.45.67:3000` (port olmadan)

### 2. Google OAuth - Authorized Redirect URIs

1. Google Cloud Console'a gidin: https://console.cloud.google.com
2. Projenizi seçin
3. **APIs & Services** > **Credentials**
4. OAuth 2.0 Client ID'nizi seçin
5. **Authorized redirect URIs** bölümüne ekleyin:
   - `http://EC2-IP-ADRESI:3000` (HTTP kullanıyorsanız)
   - `https://yourdomain.com` (HTTPS kullanıyorsanız)
   - `http://EC2-IP-ADRESI` (port olmadan)

### 3. Cookie Secure Flag Sorunu

EC2'de HTTP kullanıyorsanız, `secure: true` cookie'leri çalışmaz!

**Çözüm:** Cookie ayarlarını kontrol edin:

```typescript
// lib/actions/auth.actions.ts
cookieStore.set("session", sessionCookie, {
  maxAge: ONE_WEEK,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // HTTP'de false olmalı!
  path: "/",
  sameSite: "lax",
});
```

**EC2'de HTTP kullanıyorsanız:**
- `secure: false` yapın (geçici çözüm)
- Veya HTTPS kullanın (Nginx + Let's Encrypt)

### 4. Environment Variables Kontrolü

EC2 container'ında environment variables'ları kontrol edin:

```bash
# EC2'de container içinde
docker exec syntalkic-app env | grep FIREBASE

# Özellikle şunları kontrol edin:
# - NEXT_PUBLIC_FIREBASE_API_KEY
# - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
# - NEXT_PUBLIC_FIREBASE_PROJECT_ID
```

### 5. Browser Console Hataları

EC2'de tarayıcı console'unu açın (F12) ve şu hataları kontrol edin:
- `auth/unauthorized-domain`
- `auth/api-key-not-valid`
- `CORS` hataları

---

## 🔧 Hızlı Düzeltmeler

### Düzeltme 1: Cookie Secure Flag (HTTP için)

EC2'de HTTP kullanıyorsanız, cookie'lerin `secure: false` olması gerekir:

```typescript
// lib/actions/auth.actions.ts - setSessionCookie fonksiyonunda
cookieStore.set("session", sessionCookie, {
  maxAge: ONE_WEEK,
  httpOnly: true,
  secure: false, // HTTP için false
  path: "/",
  sameSite: "lax",
});
```

### Düzeltme 2: Firebase Auth Domain Kontrolü

EC2 container loglarını kontrol edin:

```bash
docker logs syntalkic-app | grep -i "firebase\|auth\|error"
```

### Düzeltme 3: Environment Variables Doğrulama

EC2'de container içinde test edin:

```bash
docker exec syntalkic-app node -e "
console.log('API Key:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.substring(0, 20));
console.log('Auth Domain:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
console.log('Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
"
```

---

## 📋 Adım Adım Kontrol

### Adım 1: Firebase Console Kontrolü

1. Firebase Console > Authentication > Settings
2. **Authorized domains** listesini kontrol edin
3. EC2 IP adresinizin listede olduğundan emin olun

### Adım 2: Google Cloud Console Kontrolü

1. Google Cloud Console > APIs & Services > Credentials
2. OAuth 2.0 Client ID'yi açın
3. **Authorized JavaScript origins** ve **Authorized redirect URIs** kontrol edin

### Adım 3: EC2 Container Kontrolü

```bash
# Container loglarını kontrol et
docker logs syntalkic-app --tail 50

# Environment variables'ları kontrol et
docker exec syntalkic-app env | grep NEXT_PUBLIC_FIREBASE
```

### Adım 4: Browser Console Kontrolü

EC2'de tarayıcıda:
1. F12 ile Developer Tools'u açın
2. Console sekmesine gidin
3. Giriş yapmayı deneyin
4. Hata mesajlarını not edin

---

## 🛠️ Yaygın Hatalar ve Çözümleri

### Hata 1: "auth/unauthorized-domain"

**Sebep:** Domain Firebase'de authorized değil

**Çözüm:**
1. Firebase Console > Authentication > Settings > Authorized domains
2. EC2 IP adresini ekleyin

### Hata 2: Cookie set edilmiyor

**Sebep:** `secure: true` ama HTTP kullanılıyor

**Çözüm:**
```typescript
secure: false // HTTP için
// veya
secure: process.env.NODE_ENV === "production" && process.env.USE_HTTPS === "true"
```

### Hata 3: "CORS" hatası

**Sebep:** Firebase Auth domain ayarları yanlış

**Çözüm:**
- Firebase Console'da authorized domains'i kontrol edin
- Google Cloud Console'da OAuth redirect URIs'i kontrol edin

### Hata 4: Popup açılmıyor

**Sebep:** COOP header ayarları

**Çözüm:**
- `next.config.ts`'de COOP header'ı zaten eklendi
- Container'ı yeniden build edin

---

## ✅ Test Komutları

EC2'de şu komutları çalıştırın:

```bash
# 1. Container durumunu kontrol et
docker ps | grep syntalkic

# 2. Logları kontrol et
docker logs syntalkic-app --tail 100

# 3. Environment variables'ları kontrol et
docker exec syntalkic-app env | grep -E "FIREBASE|NODE_ENV"

# 4. Container içinde curl ile test
docker exec syntalkic-app curl -I http://localhost:3000
```

---

## 🔒 Güvenli Çözüm: HTTPS Kullanın

HTTP yerine HTTPS kullanmak en güvenli çözümdür:

1. **Nginx reverse proxy** kurun
2. **Let's Encrypt SSL** sertifikası alın
3. Cookie'lerde `secure: true` kullanın

Detaylar için `DOCKER_EC2_DEPLOYMENT.md` dosyasındaki "Adım 8: Nginx Reverse Proxy" bölümüne bakın.

---

**Sorun devam ederse, EC2'deki browser console hatalarını paylaşın!**
