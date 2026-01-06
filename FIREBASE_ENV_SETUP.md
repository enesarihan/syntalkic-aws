# 🔐 Firebase Environment Variables Kurulum Rehberi

Bu rehber, Firebase Admin SDK için gerekli environment variables'ları `.env` dosyasına nasıl ekleyeceğinizi gösterir.

---

## 📋 Firebase Private Key Formatı

Firebase private key genellikle şu formatta gelir:

```
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...
...çok uzun bir base64 string...
-----END PRIVATE KEY-----
```

---

## ✅ Yöntem 1: Tek Satırda `\n` ile (Önerilen)

**Bu yöntem önerilir çünkü kodunuzda zaten `replace(/\\n/g, "\n")` kullanılıyor.**

### Adımlar:

1. Firebase Console'dan private key'i kopyalayın
2. Tüm satırları birleştirin ve her satır sonuna `\n` ekleyin
3. `.env` dosyasına şu şekilde yapıştırın:

```env
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC\n...devamı...\n-----END PRIVATE KEY-----\n"
```

**Örnek:**
```env
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC\nwJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY\n-----END PRIVATE KEY-----\n"
```

### Otomatik Dönüştürme (Online Tool)

1. Private key'i kopyalayın
2. Şu online tool'u kullanın: https://www.freeformatter.com/json-escape.html
3. Veya manuel olarak:
   - Her satır sonuna `\n` ekleyin
   - Tümünü tek satırda birleştirin
   - Çift tırnak içine alın

---

## ✅ Yöntem 2: Çift Tırnak İçinde Olduğu Gibi

**Bu yöntem de çalışır ama bazı durumlarda sorun çıkarabilir.**

```env
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC
...devamı...
-----END PRIVATE KEY-----"
```

**⚠️ Not:** Bazı sistemlerde çok satırlı değerler sorun çıkarabilir.

---

## ✅ Yöntem 3: Base64 Encode (Alternatif)

Eğer yukarıdaki yöntemler çalışmazsa:

1. Private key'i base64 encode edin
2. `.env` dosyasına ekleyin
3. Kodda decode edin

**Ancak bu yöntem şu anda kodunuzda desteklenmiyor, kod değişikliği gerekir.**

---

## 📝 Tam .env.local Örneği

```env
# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyExample123456789
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Firebase Admin SDK Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC\nwJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC\n...tüm satırlar burada...\n-----END PRIVATE KEY-----\n"

# VAPI Configuration
NEXT_PUBLIC_VAPI_WEB_TOKEN=your-vapi-web-token

# UploadThing Configuration
UPLOADTHING_SECRET=sk_live_xxxxx
UPLOADTHING_APP_ID=your-app-id

# Google Generative AI
GOOGLE_GENERATIVE_AI_API_KEY=your-google-ai-api-key
```

---

## 🔍 Private Key'i Firebase Console'dan Alma

1. Firebase Console'a gidin: https://console.firebase.google.com
2. Projenizi seçin
3. Sol menüden **⚙️ Project Settings** seçin
4. **Service Accounts** sekmesine gidin
5. **"Generate new private key"** butonuna tıklayın
6. **"Generate key"** butonuna tıklayın
7. JSON dosyası indirilecek

### JSON Dosyasından Private Key Çıkarma

İndirilen JSON dosyası şu formatta olacak:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com",
  ...
}
```

**`private_key`** değerini kopyalayın - zaten `\n` karakterleriyle geliyor!

---

## ✅ Doğrulama

### 1. .env Dosyasını Kontrol Edin

```bash
# Windows (PowerShell)
Get-Content .env.local | Select-String "FIREBASE_PRIVATE_KEY"

# Git Bash
grep FIREBASE_PRIVATE_KEY .env.local
```

### 2. Uygulamayı Test Edin

```bash
# Development server'ı başlat
npm run dev

# Eğer hata alırsanız, private key formatını kontrol edin
```

### 3. Hata Mesajları

**"Service account object must contain a string project_id property"**
- `FIREBASE_PROJECT_ID` eksik veya yanlış

**"Failed to parse private key"**
- Private key formatı yanlış
- `\n` karakterleri eksik veya fazla

**"Invalid credential"**
- Private key, client email veya project ID yanlış

---

## 🛠️ Hızlı Dönüştürme Script'i

Eğer private key'i tek satıra dönüştürmek isterseniz, şu script'i kullanabilirsiniz:

### Windows PowerShell:

```powershell
# Private key'i oku
$key = Get-Content "firebase-private-key.txt" -Raw

# Her satır sonuna \n ekle ve tek satır yap
$key = $key -replace "`r?`n", "\n"

# Çift tırnak içine al
$key = '"' + $key + '"'

# .env dosyasına yaz (manuel olarak kopyalayın)
Write-Host $key
```

### Node.js Script:

```javascript
// convert-key.js
const fs = require('fs');

const key = fs.readFileSync('firebase-private-key.txt', 'utf8');
const converted = key.replace(/\r?\n/g, '\\n');
console.log(`FIREBASE_PRIVATE_KEY="${converted}"`);
```

Kullanım:
```bash
node convert-key.js
```

---

## 📋 Özet

**✅ Önerilen Format:**
```env
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSATIR1\nSATIR2\nSATIR3\n-----END PRIVATE KEY-----\n"
```

**Önemli Noktalar:**
1. ✅ Çift tırnak (`"`) içine alın
2. ✅ Her satır sonuna `\n` ekleyin
3. ✅ Tek satırda yazın
4. ✅ Başında ve sonunda `-----BEGIN PRIVATE KEY-----` ve `-----END PRIVATE KEY-----` olsun
5. ✅ Son satırdan sonra da `\n` ekleyin

---

## 🔒 Güvenlik Notları

- ⚠️ `.env.local` dosyasını **ASLA** Git'e commit etmeyin
- ⚠️ `.gitignore` dosyasında `.env*` olmalı
- ⚠️ Private key'i kimseyle paylaşmayın
- ⚠️ Production'da environment variables'ları güvenli şekilde saklayın (AWS Secrets Manager, Parameter Store vb.)

---

**Sorularınız varsa çekinmeyin!** 🚀

