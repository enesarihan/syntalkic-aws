# Next.js uygulaması için Dockerfile
# Bu dosya uygulamanızı Docker container'a paketler

# Node.js 20 LTS versiyonunu kullanıyoruz
FROM node:20-alpine AS base

# Bağımlılıkları yüklemek için stage
FROM base AS deps
# Alpine Linux için gerekli paketler
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Package dosyalarını kopyala
COPY package.json package-lock.json* ./
# Bağımlılıkları yükle
RUN npm ci

# Uygulamayı build etmek için stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js build için gerekli environment variable'ları ayarla
ENV NEXT_TELEMETRY_DISABLED=1

# Build-time için ARG kullan (runtime'da override edilebilir)
# Bu değerler build sırasında --build-arg ile geçilebilir
ARG NEXT_PUBLIC_FIREBASE_API_KEY=dummy-build-time-api-key
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=dummy-build-time.firebaseapp.com
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID=dummy-build-time
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=dummy-build-time.appspot.com
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
ARG NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:dummy123456
ARG NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-DUMMY123

ARG FIREBASE_PROJECT_ID=dummy-build-time
ARG FIREBASE_CLIENT_EMAIL=dummy@build.time
ARG FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC\n-----END PRIVATE KEY-----\n"

# VAPI için ARG'lar
ARG NEXT_PUBLIC_VAPI_WEB_TOKEN=dummy-vapi-token
ARG NEXT_PUBLIC_VAPI_WORKFLOW_ID=dummy-workflow-id

# ARG'ları ENV'e kopyala (build-time için)
ENV NEXT_PUBLIC_FIREBASE_API_KEY=${NEXT_PUBLIC_FIREBASE_API_KEY}
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=${NEXT_PUBLIC_FIREBASE_PROJECT_ID}
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}
ENV NEXT_PUBLIC_FIREBASE_APP_ID=${NEXT_PUBLIC_FIREBASE_APP_ID}
ENV NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=${NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}
ENV FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID}
ENV FIREBASE_CLIENT_EMAIL=${FIREBASE_CLIENT_EMAIL}
ENV FIREBASE_PRIVATE_KEY=${FIREBASE_PRIVATE_KEY}
ENV NEXT_PUBLIC_VAPI_WEB_TOKEN=${NEXT_PUBLIC_VAPI_WEB_TOKEN}
ENV NEXT_PUBLIC_VAPI_WORKFLOW_ID=${NEXT_PUBLIC_VAPI_WORKFLOW_ID}

# Uygulamayı build et
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Sistem kullanıcısı oluştur (güvenlik için)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Public klasörünü kopyala
COPY --from=builder /app/public ./public

# Build edilmiş dosyaları kopyala
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Next.js standalone server'ı başlat
CMD ["node", "server.js"]


