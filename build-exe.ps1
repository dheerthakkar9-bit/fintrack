# FinTrack - Build Windows EXE
# Requirements: Rust (rustup.rs), pnpm or npm
# Run this script from the project root

Write-Output "=== Building FinTrack Windows EXE ==="

# Step 1: Install Tauri CLI
Write-Output "`n[1/4] Installing Tauri CLI..."
npm install --save-dev @tauri-apps/cli 2>&1 | Select-Object -Last 3

# Step 2: Initialize Tauri
Write-Output "`n[2/4] Setting up Tauri..."
npx tauri init --ci 2>&1 | Select-Object -Last 5

# Step 3: Build Next.js
Write-Output "`n[3/4] Building web assets..."
npx next build 2>&1 | Select-Object -Last 5
npx next export 2>&1 | Select-Object -Last 5

# Step 4: Build EXE
Write-Output "`n[4/4] Building Windows EXE..."
npx tauri build 2>&1 | Select-Object -Last 10

$exePath = "src-tauri\target\release\fintrack.exe"
if (Test-Path $exePath) {
  $dest = "FinTrack.exe"
  Copy-Item $exePath $dest -Force
  Write-Output "`nEXE built successfully!"
  Write-Output "EXE location: $((Get-Item $dest).FullName)"
  Write-Output "Size: $([math]::Round((Get-Item $dest).Length/1MB, 1)) MB"
} else {
  Write-Output "EXE not found. Ensure Rust and Tauri dependencies are installed."
  Write-Output "Install Rust: https://rustup.rs"
}
