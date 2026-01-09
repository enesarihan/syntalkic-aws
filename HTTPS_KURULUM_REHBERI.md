# 🔒 HTTPS Kurulum Rehberi - EC2 + Nginx + Let's Encrypt

Bu rehber, EC2'deki uygulamanızı HTTPS üzerinden çalıştırmak için Nginx reverse proxy ve Let's Encrypt SSL sertifikası kurulumunu adım adım açıklar.

---

## 📋 Neden HTTPS Gerekli?

- **Mikrofon Erişimi**: Tarayıcılar, `navigator.mediaDevices` API'sine yalnızca HTTPS veya localhost üzerinden erişime izin verir.
- **Güvenlik**: Kullanıcı verilerinin şifrelenmiş iletişimi.
- **Modern Web Standartları**: Birçok tarayıcı özelliği HTTPS gerektirir.

---

## 🎯 Adım 1: Nginx Kurulumu

### EC2'ye Bağlanın

```bash
ssh -i "syntalkic-key.pem" ec2-user@EC2-IP-ADRESI
```

### Nginx'i Yükleyin

**Amazon Linux 2023 için:**

```bash
sudo dnf install nginx -y
```

**Ubuntu için:**

```bash
sudo apt update
sudo apt install nginx -y
```

### Nginx'i Başlatın

```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Nginx Durumunu Kontrol Edin

```bash
sudo systemctl status nginx
```

---

## 🎯 Adım 2: Nginx Yapılandırması

### Nginx Config Dosyası Oluşturun

```bash
sudo nano /etc/nginx/conf.d/syntalkic.conf
```

Aşağıdaki içeriği yapıştırın (HTTP için - şimdilik):

```nginx
server {
    listen 80;
    server_name 18.153.51.24;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Not:** `EC2-PUBLIC-IP-ADRESI` yerine kendi EC2 IP adresinizi veya domain adınızı yazın.

### Nginx Config'i Test Edin

```bash
sudo nginx -t
```

### Nginx'i Yeniden Başlatın

```bash
sudo systemctl restart nginx
```

### Firewall Ayarları

```bash
# HTTP (port 80) ve HTTPS (port 443) portlarını aç
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload

# Veya AWS Security Group'ta:
# - Port 80 (HTTP) -> 0.0.0.0/0
# - Port 443 (HTTPS) -> 0.0.0.0/0
```

---

## 🎯 Adım 3: Let's Encrypt SSL Sertifikası

### Certbot Kurulumu

**Amazon Linux 2023 için:**

```bash
sudo dnf install certbot python3-certbot-nginx -y
```

**Ubuntu için:**

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### SSL Sertifikası Alın

**IP Adresi ile (Sınırlı):**

Let's Encrypt genellikle domain adı gerektirir. IP adresi ile çalışmak için:

```bash
# Domain adınız varsa:
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# IP adresi ile (sınırlı destek):
# Not: Let's Encrypt IP adresi ile çalışmaz, domain gerekir
```

**Domain Adı Olmadan Alternatif:**

Eğer domain adınız yoksa, şimdilik self-signed sertifika kullanabilirsiniz (tarayıcı uyarısı verecek ama çalışır):

```bash
# Self-signed sertifika oluştur
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/syntalkic.key \
  -out /etc/nginx/ssl/syntalkic.crt \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=18.153.51.24"

# SSL klasörünü oluştur
sudo mkdir -p /etc/nginx/ssl
```

### Nginx Config'i HTTPS için Güncelleyin

```bash
sudo nano /etc/nginx/conf.d/syntalkic.conf
```

HTTPS yapılandırması:

```nginx
# HTTP'den HTTPS'e yönlendirme
server {
    listen 80;
    server_name 18.153.51.24;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name EC2-PUBLIC-IP-ADRESI;

    # Self-signed sertifika (domain yoksa)
    ssl_certificate /etc/nginx/ssl/syntalkic.crt;
    ssl_certificate_key /etc/nginx/ssl/syntalkic.key;

    # Let's Encrypt sertifikası (domain varsa)
    # ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # SSL ayarları
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Nginx'i Yeniden Başlatın

```bash
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🎯 Adım 4: Environment Variables Güncelleme

### `.env.production` Dosyasını Güncelleyin

```bash
cd ~/projects/syntalkic-aws
nano .env.production
```

HTTPS kullanımını etkinleştirin:

```env
# HTTPS kullanımını etkinleştir
USE_HTTPS=true
```

### Container'ı Yeniden Başlatın

```bash
docker stop syntalkic-app
docker rm syntalkic-app

docker run -d \
  --name syntalkic-app \
  -p 3000:3000 \
  --env-file .env.production \
  --restart unless-stopped \
  syntalkic:latest
```

---

## 🎯 Adım 5: Test

### HTTP Yönlendirmesi

```bash
# HTTP'ye istek atın, HTTPS'e yönlendirilmeli
curl -I http://EC2-PUBLIC-IP-ADRESI
```

### HTTPS Erişimi

Tarayıcıda açın:

```
https://EC2-PUBLIC-IP-ADRESI
```

**Not:** Self-signed sertifika kullanıyorsanız, tarayıcı bir güvenlik uyarısı gösterecek. "Gelişmiş" > "Devam Et" ile geçebilirsiniz.

### Mikrofon Testi

1. Tarayıcıda uygulamayı açın
2. "Call" butonuna tıklayın
3. Mikrofon izni isteği gelmeli
4. İzin verin
5. Konuşma başlamalı

---

## 🔧 Sorun Giderme

### Nginx Çalışmıyor

```bash
# Nginx durumunu kontrol et
sudo systemctl status nginx

# Nginx loglarını kontrol et
sudo tail -f /var/log/nginx/error.log
```

### SSL Sertifika Hatası

```bash
# Sertifika dosyalarını kontrol et
sudo ls -la /etc/nginx/ssl/

# Sertifika bilgilerini görüntüle
sudo openssl x509 -in /etc/nginx/ssl/syntalkic.crt -text -noout
```

### Port Çakışması

```bash
# Port 80 ve 443'ün kullanımını kontrol et
sudo netstat -tulpn | grep -E ':(80|443)'
```

### Docker Container Erişilemiyor

```bash
# Container'ın çalıştığını kontrol et
docker ps | grep syntalkic

# Container loglarını kontrol et
docker logs syntalkic-app
```

---

## 📝 Domain Adı Alma (Opsiyonel)

Eğer domain adınız yoksa, şu servislerden ücretsiz domain alabilirsiniz:

- **Freenom** (ücretsiz .tk, .ml, .ga domain'leri)
- **Cloudflare** (domain satın alma)
- **Namecheap** (ucuz domain'ler)

Domain aldıktan sonra:

1. Domain'in DNS ayarlarını yapın (A record -> EC2 IP adresi)
2. Let's Encrypt ile gerçek SSL sertifikası alın
3. Nginx config'i güncelleyin

---

## ✅ Başarı Kontrolü

HTTPS kurulumu başarılı olduğunda:

- ✅ `https://EC2-IP-ADRESI` erişilebilir
- ✅ Tarayıcıda kilit ikonu görünüyor (self-signed için uyarı olabilir)
- ✅ Mikrofon izni isteniyor
- ✅ VAPI konuşma başlatılabiliyor
- ✅ `enumerateDevices` hatası yok

---

**HTTPS kurulumu tamamlandı! 🎉**
