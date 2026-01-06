#!/bin/bash
# Docker build script with environment variables from .env.local

# .env.local dosyasından değişkenleri oku
source .env.local

# Docker build komutu - gerçek environment variables ile
docker build \
  --build-arg NEXT_PUBLIC_FIREBASE_API_KEY="$NEXT_PUBLIC_FIREBASE_API_KEY" \
  --build-arg NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" \
  --build-arg NEXT_PUBLIC_FIREBASE_PROJECT_ID="$NEXT_PUBLIC_FIREBASE_PROJECT_ID" \
  --build-arg NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET" \
  --build-arg NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID" \
  --build-arg NEXT_PUBLIC_FIREBASE_APP_ID="$NEXT_PUBLIC_FIREBASE_APP_ID" \
  --build-arg NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="$NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID" \
  --build-arg FIREBASE_PROJECT_ID="$FIREBASE_PROJECT_ID" \
  --build-arg FIREBASE_CLIENT_EMAIL="$FIREBASE_CLIENT_EMAIL" \
  --build-arg FIREBASE_PRIVATE_KEY="$FIREBASE_PRIVATE_KEY" \
  --build-arg NEXT_PUBLIC_VAPI_WEB_TOKEN="$NEXT_PUBLIC_VAPI_WEB_TOKEN" \
  --build-arg NEXT_PUBLIC_VAPI_WORKFLOW_ID="$NEXT_PUBLIC_VAPI_WORKFLOW_ID" \
  -t syntalkic:latest .

echo "Build tamamlandı! Container'ı çalıştırmak için:"
echo "docker run -d --name syntalkic-test -p 3000:3000 --env-file .env.local syntalkic:latest"

