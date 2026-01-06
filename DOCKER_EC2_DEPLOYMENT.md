# 🐳 Docker + EC2 Deployment - Adım Adım Rehber

Bu rehber, Syntalkic projenizi Docker ve EC2 kullanarak AWS'ye deploy etmenizi adım adım öğretir.

---

## 📋 İçindekiler

1. [Adım 1: Yerel Docker Test](#adım-1-yerel-docker-test)
2. [Adım 2: EC2 Instance Oluşturma](#adım-2-ec2-instance-oluşturma)
3. [Adım 3: EC2'ye Bağlanma](#adım-3-ec2ye-bağlanma)
4. [Adım 4: Docker Kurulumu](#adım-4-docker-kurulumu)
5. [Adım 5: Projeyi EC2'ye Yükleme](#adım-5-projeyi-ec2ye-yükleme)
6. [Adım 6: Environment Variables Ayarlama](#adım-6-environment-variables-ayarlama)
7. [Adım 7: Docker Container Çalıştırma](#adım-7-docker-container-çalıştırma)
8. [Adım 8: Nginx Reverse Proxy (Opsiyonel)](#adım-8-nginx-reverse-proxy-opsiyonel)

---

## 🎯 Adım 1: Yerel Docker Test

### 1.1 Docker'ın Kurulu Olduğunu Kontrol Edin

```bash
# Docker versiyonunu kontrol et
docker --version

# Docker Compose versiyonunu kontrol et
docker-compose --version
```

**Eğer Docker kurulu değilse:**
- Windows: [Docker Desktop](https://www.docker.com/products/docker-desktop/) indirin ve kurun
- Kurulumdan sonra bilgisayarı yeniden başlatın

### 1.2 Docker Image'ı Build Edin

```bash
# Proje klasörüne gidin
cd /c/Users/90537/Documents/syntalkic

# Docker image'ı build edin
docker build -t syntalkic:latest .
```

**Ne yapıyoruz?**
- `-t syntalkic:latest`: Image'a bir isim veriyoruz (tag)
- `.`: Mevcut klasörü Docker context olarak kullanıyoruz

**Bu işlem 5-10 dakika sürebilir.** İlk kez build ederken tüm bağımlılıklar indirilir.

### 1.3 Build'i Test Edin

```bash
# Container'ı çalıştırın (yerel test için)
docker run -p 3000:3000 \
  --env-file .env.local \
  syntalkic:latest
```

**Ne yapıyoruz?**
- `-p 3000:3000`: Host'un 3000 portunu container'ın 3000 portuna bağlıyoruz
- `--env-file .env.local`: Environment variable'ları dosyadan yüklüyoruz
- `syntalkic:latest`: Build ettiğimiz image'ı kullanıyoruz

**Test:**
- Tarayıcıda `http://localhost:3000` adresine gidin
- Uygulama çalışıyorsa başarılı! ✅
- Durdurmak için: `Ctrl+C`

### 1.4 Docker Compose ile Test (Alternatif)

```bash
# Docker Compose ile çalıştır
docker-compose up

# Arka planda çalıştırmak için:
docker-compose up -d

# Durdurmak için:
docker-compose down
```

**✅ Adım 1 Tamamlandı!** Yerel Docker test başarılı.

---

## 🖥️ Adım 2: EC2 Instance Oluşturma

### 2.1 AWS Console'a Giriş

1. https://console.aws.amazon.com adresine gidin
2. AWS hesabınızla giriş yapın
3. Arama çubuğuna **"EC2"** yazın ve seçin

### 2.2 Launch Instance

1. **"Launch Instance"** butonuna tıklayın

### 2.3 Instance Ayarları

#### Name and tags
- **Name**: `syntalkic-server`

#### Application and OS Images (AMI)
- **Amazon Linux**: **Amazon Linux 2023 AMI** seçin (ücretsiz tier)
- Veya **Ubuntu Server 22.04 LTS** (popüler seçenek)

#### Instance type
- **t2.micro** seçin (Free Tier - ücretsiz)
  - 1 vCPU, 1 GB RAM
  - Küçük uygulamalar için yeterli

#### Key pair (login)
- **"Create new key pair"** tıklayın
- **Key pair name**: `syntalkic-key`
- **Key pair type**: RSA
- **Private key file format**: `.pem` (Linux/Mac) veya `.ppk` (Windows PuTTY)
- **"Create key pair"** tıklayın
- **⚠️ ÖNEMLİ**: İndirilen `.pem` dosyasını güvenli bir yere kaydedin!

#### Network settings
- **"Edit"** butonuna tıklayın
- **Security group name**: `syntalkic-sg`
- **Description**: `Security group for Syntalkic application`

**Inbound security group rules ekleyin:**
1. **SSH** (22):
   - Type: SSH
   - Source: My IP (otomatik) veya 0.0.0.0/0 (her yerden - güvensiz ama test için)

2. **HTTP** (80):
   - Type: HTTP
   - Source: 0.0.0.0/0

3. **HTTPS** (443):
   - Type: HTTPS
   - Source: 0.0.0.0/0

4. **Custom TCP** (3000) - Opsiyonel:
   - Type: Custom TCP
   - Port: 3000
   - Source: 0.0.0.0/0

#### Configure storage
- **Size**: 8 GB (Free Tier limiti)
- **Volume type**: gp3 (varsayılan)

### 2.4 Launch Instance

1. **"Launch Instance"** butonuna tıklayın
2. **"View all instances"** tıklayın
3. Instance'ın **"running"** durumuna gelmesini bekleyin (1-2 dakika)

### 2.5 Public IP Adresini Not Edin

1. Instance'ı seçin
2. **"Public IPv4 address"** değerini kopyalayın
   - Örnek: `54.123.45.67`
   - Bu IP'yi kullanarak EC2'ye bağlanacağız

**✅ Adım 2 Tamamlandı!** EC2 instance hazır.

---

## 🔌 Adım 3: EC2'ye Bağlanma

### 3.1 Windows'ta SSH Bağlantısı

#### Git Bash Kullanarak (Önerilen)

```bash
# Key dosyasının izinlerini ayarla (Git Bash'te)
chmod 400 /c/Users/90537/Documents/syntalkic/syntalkic-key.pem

# EC2'ye bağlan
ssh -i "syntalkic-key.pem" ec2-user@EC2-IP-ADRESI

# Örnek:
ssh -i "syntalkic-key.pem" ec2-user@54.123.45.67
```

**Not:** 
- Amazon Linux için kullanıcı: `ec2-user`
- Ubuntu için kullanıcı: `ubuntu`

#### İlk Bağlantıda

İlk kez bağlanırken şu mesajı göreceksiniz:
```
The authenticity of host '54.123.45.67' can't be established.
Are you sure you want to continue connecting (yes/no)?
```
**`yes`** yazın ve Enter'a basın.

#### Bağlantı Başarılı!

Bağlantı başarılı olduğunda şu şekilde bir prompt göreceksiniz:
```
[ec2-user@ip-172-31-xx-xx ~]$
```

**✅ Adım 3 Tamamlandı!** EC2'ye bağlandınız.

---

## 🐳 Adım 4: Docker Kurulumu

### 4.1 Sistem Güncellemesi

```bash
# Amazon Linux 2023 için
sudo yum update -y

# Ubuntu için (eğer Ubuntu kullandıysanız)
# sudo apt update && sudo apt upgrade -y
```

### 4.2 Docker Kurulumu

#### Amazon Linux 2023 için:

```bash
# Docker'ı yükle
sudo yum install docker -y

# Docker servisini başlat
sudo service docker start

# Docker'ın otomatik başlamasını sağla
sudo systemctl enable docker

# Kullanıcıyı docker grubuna ekle (sudo olmadan kullanmak için)
sudo usermod -a -G docker ec2-user

# Değişikliklerin uygulanması için çıkış yap ve tekrar giriş yap
exit
```

**Tekrar bağlan:**
```bash
ssh -i "syntalkic-key.pem" ec2-user@EC2-IP-ADRESI
```

#### Docker Kurulumunu Test Edin

```bash
# Docker versiyonunu kontrol et
docker --version

# Docker'ı sudo olmadan çalıştır (grup değişikliği için tekrar giriş gerekebilir)
docker ps

# Eğer "permission denied" hatası alırsanız:
sudo docker ps
```

### 4.3 Docker Compose Kurulumu

```bash
# Docker Compose'u indir
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Çalıştırılabilir yap
sudo chmod +x /usr/local/bin/docker-compose

# Versiyonunu kontrol et
docker-compose --version
```

**✅ Adım 4 Tamamlandı!** Docker kuruldu.

---

## 📦 Adım 5: Projeyi EC2'ye Yükleme

### Yöntem A: Git ile (Önerilen)

#### 5.1 Git Kurulumu

```bash
# Git yükle
sudo yum install git -y

# Git versiyonunu kontrol et
git --version
```

#### 5.2 Repository'yi Klonla

```bash
# Proje klasörü oluştur
mkdir -p ~/projects
cd ~/projects

# GitHub repository'nizi klonla
git clone https://github.com/KULLANICI_ADINIZ/syntalkic-aws.git

# Proje klasörüne git
cd syntalkic-aws
```

**Not:** `KULLANICI_ADINIZ` kısmını GitHub kullanıcı adınızla değiştirin.

### Yöntem B: SCP ile Dosya Transferi (Alternatif)

**Windows'tan (Git Bash):**

```bash
# Proje klasörüne git
cd /c/Users/90537/Documents/syntalkic

# Tüm projeyi EC2'ye kopyala
scp -i "syntalkic-key.pem" -r . ec2-user@EC2-IP-ADRESI:~/syntalkic

# EC2'de proje klasörüne git
ssh -i "syntalkic-key.pem" ec2-user@EC2-IP-ADRESI
cd ~/syntalkic
```

**⚠️ Not:** `.env.local` dosyası transfer edilmeyecek (güvenlik için).

### 5.3 Proje Dosyalarını Kontrol Edin

```bash
# EC2'de proje klasöründe
ls -la

# Şunları görmelisiniz:
# - package.json
# - Dockerfile
# - docker-compose.yml
# - app/
# - components/
# vb.
```

**✅ Adım 5 Tamamlandı!** Proje EC2'de.

---

## 🔐 Adım 6: Environment Variables Ayarlama

### 6.1 Environment Variables Dosyası Oluşturma

```bash
# EC2'de proje klasöründe
cd ~/projects/syntalkic-aws
# veya
cd ~/syntalkic

# Environment variables dosyası oluştur
nano .env.production
```

### 6.2 Environment Variables'ları Ekleyin

Nano editörde aşağıdaki içeriği yapıştırın (kendi değerlerinizle):

```env
# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Firebase Admin
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"

# VAPI
NEXT_PUBLIC_VAPI_WEB_TOKEN=your-vapi-token

# UploadThing
UPLOADTHING_SECRET=sk_live_xxxxx
UPLOADTHING_APP_ID=your-app-id

# Google AI
GOOGLE_GENERATIVE_AI_API_KEY=your-google-ai-key
```

**Nano Editör Kullanımı:**
- Dosyayı kaydetmek: `Ctrl+O`, Enter, `Ctrl+X`
- Çıkmak: `Ctrl+X`

### 6.3 Dosya İzinlerini Ayarlayın

```bash
# Dosyayı sadece sahibi okuyabilsin (güvenlik)
chmod 600 .env.production

# Dosyanın içeriğini kontrol et (opsiyonel)
cat .env.production
```

**✅ Adım 6 Tamamlandı!** Environment variables hazır.

---

## 🚀 Adım 7: Docker Container Çalıştırma

### 7.1 Docker Image Build

```bash
# Proje klasöründe
cd ~/projects/syntalkic-aws
# veya
cd ~/syntalkic

# Docker image'ı build et
docker build -t syntalkic:latest .

# Bu işlem 5-10 dakika sürebilir
```

**Ne oluyor?**
- Docker, Dockerfile'daki talimatları takip ederek image oluşturuyor
- Tüm bağımlılıklar indiriliyor
- Next.js uygulaması build ediliyor

### 7.2 Container'ı Çalıştırma

```bash
# Container'ı çalıştır
docker run -d \
  --name syntalkic-app \
  -p 3000:3000 \
  --env-file .env.production \
  --restart unless-stopped \
  syntalkic:latest
```

**Ne yapıyoruz?**
- `-d`: Detached mode (arka planda çalıştır)
- `--name syntalkic-app`: Container'a isim ver
- `-p 3000:3000`: Port mapping (host:container)
- `--env-file .env.production`: Environment variables dosyasını kullan
- `--restart unless-stopped`: Otomatik yeniden başlatma
- `syntalkic:latest`: Build ettiğimiz image

### 7.3 Container Durumunu Kontrol Edin

```bash
# Çalışan container'ları listele
docker ps

# Container loglarını görüntüle
docker logs syntalkic-app

# Canlı log takibi
docker logs -f syntalkic-app
```

**Başarılı çıktı örneği:**
```
- ready started server on 0.0.0.0:3000
```

### 7.4 Uygulamayı Test Edin

1. Tarayıcıda EC2 Public IP'nizi açın: `http://EC2-IP-ADRESI:3000`
2. Uygulama yükleniyorsa başarılı! ✅

**Eğer erişemiyorsanız:**
- Security Group'da port 3000'in açık olduğundan emin olun
- Container loglarını kontrol edin: `docker logs syntalkic-app`

### 7.5 Yararlı Docker Komutları

```bash
# Container'ı durdur
docker stop syntalkic-app

# Container'ı başlat
docker start syntalkic-app

# Container'ı yeniden başlat
docker restart syntalkic-app

# Container'ı sil
docker rm syntalkic-app

# Container ve image'ı birlikte sil
docker rm -f syntalkic-app
docker rmi syntalkic:latest

# Tüm durmuş container'ları temizle
docker container prune
```

**✅ Adım 7 Tamamlandı!** Uygulama çalışıyor!

---

## 🌐 Adım 8: Nginx Reverse Proxy (Opsiyonel)

Port 80'den erişim için Nginx kullanabilirsiniz.

### 8.1 Nginx Kurulumu

```bash
# Nginx yükle
sudo yum install nginx -y

# Nginx'i başlat
sudo systemctl start nginx

# Otomatik başlatmayı etkinleştir
sudo systemctl enable nginx
```

### 8.2 Nginx Konfigürasyonu

```bash
# Nginx config dosyası oluştur
sudo nano /etc/nginx/conf.d/syntalkic.conf
```

**İçeriği ekleyin:**

```nginx
server {
    listen 80;
    server_name EC2-IP-ADRESI;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Kaydedin:** `Ctrl+O`, Enter, `Ctrl+X`

### 8.3 Nginx'i Yeniden Başlatın

```bash
# Config'i test et
sudo nginx -t

# Nginx'i yeniden yükle
sudo systemctl reload nginx

# Veya yeniden başlat
sudo systemctl restart nginx
```

### 8.4 Test Edin

Tarayıcıda: `http://EC2-IP-ADRESI` (port numarası olmadan)

**✅ Adım 8 Tamamlandı!** Nginx çalışıyor!

---

## 🔒 SSL Sertifikası (Let's Encrypt)

Domain adınız varsa ücretsiz SSL sertifikası alabilirsiniz.

### 8.5 Certbot Kurulumu

```bash
# Certbot yükle
sudo yum install certbot python3-certbot-nginx -y

# SSL sertifikası al (domain adınız varsa)
sudo certbot --nginx -d syntalkic.com -d www.syntalkic.com

# Otomatik yenileme test et
sudo certbot renew --dry-run
```

**✅ SSL Aktif!** Artık `https://syntalkic.com` adresinden erişebilirsiniz!

---

## 📊 Monitoring ve Log Yönetimi

### Logları Görüntüleme

```bash
# Docker container logları
docker logs syntalkic-app

# Son 100 satır
docker logs --tail 100 syntalkic-app

# Canlı takip
docker logs -f syntalkic-app

# Nginx logları
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Sistem Kaynaklarını İzleme

```bash
# CPU ve memory kullanımı
top

# Disk kullanımı
df -h

# Docker container kaynak kullanımı
docker stats syntalkic-app
```

---

## 🔄 Güncelleme İşlemi

Kod değişikliklerini deploy etmek için:

```bash
# EC2'ye bağlan
ssh -i "syntalkic-key.pem" ec2-user@EC2-IP-ADRESI

# Proje klasörüne git
cd ~/projects/syntalkic-aws

# Yeni değişiklikleri çek
git pull origin main

# Eski container'ı durdur ve sil
docker stop syntalkic-app
docker rm syntalkic-app

# Yeni image build et
docker build -t syntalkic:latest .

# Yeni container'ı çalıştır
docker run -d \
  --name syntalkic-app \
  -p 3000:3000 \
  --env-file .env.production \
  --restart unless-stopped \
  syntalkic:latest
```

---

## ✅ Deployment Checklist

- [ ] Docker yerel test başarılı
- [ ] EC2 instance oluşturuldu
- [ ] Security Group yapılandırıldı
- [ ] EC2'ye SSH ile bağlanıldı
- [ ] Docker kuruldu
- [ ] Proje EC2'ye yüklendi
- [ ] Environment variables ayarlandı
- [ ] Docker image build edildi
- [ ] Container çalıştırıldı
- [ ] Uygulama erişilebilir
- [ ] Nginx kuruldu (opsiyonel)
- [ ] SSL sertifikası alındı (opsiyonel)

---

## 🆘 Sorun Giderme

### Problem: "Cannot connect to Docker daemon"

**Çözüm:**
```bash
sudo service docker start
sudo usermod -a -G docker ec2-user
# Çıkış yap ve tekrar giriş yap
```

### Problem: "Port 3000 already in use"

**Çözüm:**
```bash
# Hangi process kullanıyor kontrol et
sudo lsof -i :3000

# Container'ı durdur
docker stop syntalkic-app
```

### Problem: "Permission denied" hatası

**Çözüm:**
```bash
# Dosya izinlerini kontrol et
ls -la .env.production

# İzinleri düzelt
chmod 600 .env.production
```

### Problem: Uygulama çalışmıyor

**Çözüm:**
```bash
# Logları kontrol et
docker logs syntalkic-app

# Container durumunu kontrol et
docker ps -a

# Environment variables'ı kontrol et
docker exec syntalkic-app env
```

---

**🎉 Tebrikler! Deployment tamamlandı!**

Artık uygulamanız AWS EC2'de çalışıyor. Sorularınız varsa çekinmeyin!

