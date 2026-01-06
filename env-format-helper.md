# 🔧 .env.local Dosyası Format Düzeltme Rehberi

## Firebase Private Key Formatı (Satır 9-36)

`.env.local` dosyanızda **FIREBASE_PRIVATE_KEY** değişkeni şu formatta olmalı:

### ✅ Doğru Format:

```env
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC\nwJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC\n...tüm satırlar burada...\n-----END PRIVATE KEY-----\n"
```

### ❌ Yanlış Formatlar:

```env
# YANLIŞ 1: Çok satırlı (bazı sistemlerde çalışmaz)
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC
-----END PRIVATE KEY-----"

# YANLIŞ 2: Tırnak yok
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...

# YANLIŞ 3: \n karakterleri eksik
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC-----END PRIVATE KEY-----"
```

---

## 📝 Adım Adım Düzeltme

### 1. Firebase Console'dan Private Key Alın

1. Firebase Console: https://console.firebase.google.com
2. Projenizi seçin
3. ⚙️ **Project Settings** > **Service Accounts**
4. **"Generate new private key"** butonuna tıklayın
5. JSON dosyası indirilecek

### 2. JSON Dosyasından Private Key'i Kopyalayın

İndirilen JSON dosyasını açın ve `private_key` değerini bulun:

```json
{
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC\n...\n-----END PRIVATE KEY-----\n"
}
```

**ÖNEMLİ:** Bu değer zaten `\n` karakterleriyle geliyor! Olduğu gibi kopyalayın.

### 3. .env.local Dosyasına Yapıştırın

```env
FIREBASE_PRIVATE_KEY="[buraya kopyaladığınız değeri yapıştırın]"
```

**Örnek:**
```env
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC\nwJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC\n-----END PRIVATE KEY-----\n"
```

---

## 🔍 Kontrol Listesi

- [ ] Çift tırnak (`"`) ile başlıyor ve bitiyor
- [ ] Tek satırda yazılmış (satır sonları yok)
- [ ] Her satır sonunda `\n` karakteri var
- [ ] `-----BEGIN PRIVATE KEY-----` ile başlıyor
- [ ] `-----END PRIVATE KEY-----` ile bitiyor
- [ ] Son satırdan sonra da `\n` var

---

## 🛠️ Manuel Dönüştürme (Eğer Gerekirse)

Eğer private key'iniz çok satırlı formattaysa, şu adımları izleyin:

1. Her satırı kopyalayın
2. Her satır sonuna `\n` ekleyin
3. Tümünü tek satırda birleştirin
4. Çift tırnak içine alın

**Örnek Dönüştürme:**

**Giriş (çok satırlı):**
```
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC
wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
-----END PRIVATE KEY-----
```

**Çıkış (tek satır, .env formatında):**
```
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC\nwJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY\n-----END PRIVATE KEY-----\n"
```

---

## ✅ Test Etme

Düzeltmeden sonra:

```bash
# Development server'ı başlat
npm run dev

# Eğer hata alırsanız:
# - "Failed to parse private key" → Format yanlış
# - "Service account object must contain..." → project_id eksik
# - "Invalid credential" → Değerler yanlış
```

---

**Sorunuz varsa çekinmeyin!** 🚀

