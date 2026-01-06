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
# NOT: Production'da bu değerler AWS'den gelecek
ENV NEXT_TELEMETRY_DISABLED 1

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


