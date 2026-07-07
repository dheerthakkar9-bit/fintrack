# FinTrack - Build Android APK
# Requirements: Java JDK 17+, Android SDK, Android Studio
# Run this script from the project root

Write-Output "=== Building FinTrack Android APK ==="

# Step 1: Static export
Write-Output "`n[1/5] Building static site..."
$originalConfig = Get-Content "next.config.js" -Raw
$configForExport = $originalConfig -replace 'output: "export"', 'output: "export"'
$configForExport = $configForExport -replace 'images: { remotePatterns.*?\}', 'images: { unoptimized: true }'
Set-Content "next.config.js" $configForExport

npx next build 2>&1 | Select-Object -Last 10
if ($LASTEXITCODE -ne 0) { Write-Output "Build failed!"; exit 1 }

# Restore original config
Set-Content "next.config.js" $originalConfig

# Step 2: Add Android platform
Write-Output "`n[2/5] Adding Android platform..."
npx cap add android 2>&1 | Select-Object -Last 5

# Step 3: Sync web assets
Write-Output "`n[3/5] Syncing web assets..."
npx cap sync android 2>&1 | Select-Object -Last 5

# Step 4: Build APK (requires Android SDK)
Write-Output "`n[4/5] Building APK..."
Set-Location "android"
if (Test-Path "gradlew.bat") {
  & .\gradlew.bat assembleDebug 2>&1 | Select-Object -Last 10
  $apkPath = "app\build\outputs\apk\debug\app-debug.apk"
  if (Test-Path $apkPath) {
    $dest = "..\FinTrack.apk"
    Copy-Item $apkPath $dest -Force
    Write-Output "`n[5/5] APK built successfully!"
    Write-Output "APK location: $((Get-Item $dest).FullName)"
    Write-Output "Size: $([math]::Round((Get-Item $dest).Length/1MB, 1)) MB"
  } else {
    Write-Output "APK not found. Check Android SDK installation."
  }
} else {
  Write-Output "gradlew.bat not found. Install Android SDK and Android Studio."
}
Set-Location ".."
