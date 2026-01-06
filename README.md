# Syntalkic - AI Asistan Uygulaması

Bu proje [Next.js](https://nextjs.org) 15 ve Firebase kullanılarak geliştirilmiş bir AI asistan uygulamasıdır.

## 🚀 Hızlı Başlangıç

### Gereksinimler

- Node.js 20+
- npm veya yarn
- Firebase hesabı
- AWS hesabı (deployment için)

### Yerel Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Environment variables dosyası oluşturun:
```bash
# .env.local dosyası oluşturun ve aşağıdaki değişkenleri ekleyin
```

Gerekli environment variables:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `NEXT_PUBLIC_VAPI_WEB_TOKEN`
- `UPLOADTHING_SECRET`
- `UPLOADTHING_APP_ID`
- `GOOGLE_GENERATIVE_AI_API_KEY`

3. Development server'ı başlatın:
```bash
npm run dev
```

4. Tarayıcıda açın: [http://localhost:3000](http://localhost:3000)

## 📦 Build ve Production

### Production Build
```bash
npm run build
npm start
```

### Docker ile Çalıştırma
```bash
# Docker image oluştur
docker build -t syntalkic:latest .

# Container'ı çalıştır
docker run -p 3000:3000 --env-file .env.local syntalkic:latest

# Docker Compose ile (tüm servisler için)
docker-compose up
```

## ☁️ AWS'e Deployment

Bu proje AWS'ye deploy edilmek için hazırlanmıştır. Detaylı rehber için:

- **[AWS Deployment Rehberi](./AWS_DEPLOYMENT_REHBERI.md)** - Adım adım deployment talimatları
- **[AWS Temel Bilgiler](./AWS_TEMEL_BILGILER.md)** - AWS'i sıfırdan öğrenme rehberi

### Hızlı Deployment (AWS Amplify)

1. Projeyi GitHub'a yükleyin
2. AWS Amplify Console'a gidin
3. "New app" > "Host web app" seçin
4. GitHub repository'nizi bağlayın
5. Environment variables'ları ekleyin
6. Deploy edin!

Detaylar için [AWS_DEPLOYMENT_REHBERI.md](./AWS_DEPLOYMENT_REHBERI.md) dosyasına bakın.

## 🛠️ Teknolojiler

- **Framework**: Next.js 15
- **UI**: React 19, Tailwind CSS, Radix UI
- **Backend**: Firebase (Auth, Firestore)
- **AI**: Google Generative AI, VAPI
- **File Upload**: UploadThing
- **Deployment**: AWS Amplify / Docker + EC2

## 📚 Dokümantasyon

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [AWS Documentation](https://docs.aws.amazon.com/)

## 📝 Lisans

Bu proje özel bir projedir.
