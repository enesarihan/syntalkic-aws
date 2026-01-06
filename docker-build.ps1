# Docker build script with environment variables from .env.local (PowerShell)

# .env.local dosyasından değişkenleri oku
$envVars = @{}
Get-Content .env.local | ForEach-Object {
    if ($_ -match '^([^=]+)=(.*)$') {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim()
        # Çift tırnakları kaldır
        $value = $value -replace '^"|"$', ''
        $envVars[$key] = $value
    }
}

# Docker build komutu - gerçek environment variables ile
$buildArgs = @(
    "build",
    "--build-arg", "NEXT_PUBLIC_FIREBASE_API_KEY=$($envVars['NEXT_PUBLIC_FIREBASE_API_KEY'])",
    "--build-arg", "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$($envVars['NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'])",
    "--build-arg", "NEXT_PUBLIC_FIREBASE_PROJECT_ID=$($envVars['NEXT_PUBLIC_FIREBASE_PROJECT_ID'])",
    "--build-arg", "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$($envVars['NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'])",
    "--build-arg", "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$($envVars['NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'])",
    "--build-arg", "NEXT_PUBLIC_FIREBASE_APP_ID=$($envVars['NEXT_PUBLIC_FIREBASE_APP_ID'])",
    "--build-arg", "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=$($envVars['NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID'])",
    "--build-arg", "FIREBASE_PROJECT_ID=$($envVars['FIREBASE_PROJECT_ID'])",
    "--build-arg", "FIREBASE_CLIENT_EMAIL=$($envVars['FIREBASE_CLIENT_EMAIL'])",
    "--build-arg", "FIREBASE_PRIVATE_KEY=$($envVars['FIREBASE_PRIVATE_KEY'])",
    "--build-arg", "NEXT_PUBLIC_VAPI_WEB_TOKEN=$($envVars['NEXT_PUBLIC_VAPI_WEB_TOKEN'])",
    "--build-arg", "NEXT_PUBLIC_VAPI_WORKFLOW_ID=$($envVars['NEXT_PUBLIC_VAPI_WORKFLOW_ID'])",
    "-t", "syntalkic:latest",
    "."
)

docker $buildArgs

Write-Host "`nBuild tamamlandı! Container'ı çalıştırmak için:"
Write-Host "docker run -d --name syntalkic-test -p 3000:3000 --env-file .env.local syntalkic:latest"

