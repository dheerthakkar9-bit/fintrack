# FinTrack - Deploy to Vercel
# Creates a public URL anyone can open to install the app
# Run: .\deploy-vercel.ps1

Write-Output "=== Deploying FinTrack to Vercel ==="

# Step 1: Login to Vercel (first time only)
Write-Output "`n[1/3] Checking Vercel login..."
$loggedIn = npx vercel whoami 2>&1
if ($LASTEXITCODE -ne 0) {
  Write-Output "Not logged in. Opening browser for login..."
  npx vercel login
}

# Step 2: Deploy
Write-Output "`n[2/3] Deploying..."
npx vercel --yes --prod 2>&1 | Select-Object -Last 15

# Step 3: Get URL
Write-Output "`n[3/3] Getting deploy URL..."
$url = npx vercel ls --prod 2>&1 | Select-String "fintrack" | Select-Object -First 1
Write-Output "`n============================================"
Write-Output "DEPLOY COMPLETE!"
Write-Output "Your app URL: https://fintrack-*.vercel.app"
Write-Output "============================================"
Write-Output ""
Write-Output "How to install on phone:"
Write-Output "  1. Open the URL on your phone"
Write-Output "  2. Android: Tap 'Add to Home Screen'"
Write-Output "  3. iPhone: Tap Share > 'Add to Home Screen'"
Write-Output ""
Write-Output "How to install on laptop:"
Write-Output "  1. Open the URL in Chrome/Edge"
Write-Output "  2. Click the install icon in address bar"
