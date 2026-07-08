@echo off
call "C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\VC\Auxiliary\Build\vcvarsall.bat" x64
set PATH=C:\Users\dheer\.cargo\bin;C:\Program Files\nodejs;C:\Program Files\Git\cmd;%PATH%
cd /d C:\Users\dheer\projects\fintrack

echo === Preparing static export ===
node prepare-export.js

echo === Building Next.js ===
set NEXT_TELEMETRY_DISABLED=1
call npx next build

echo === Building Tauri EXE ===
call npx tauri build

echo === Copying EXE ===
if exist "src-tauri\target\release\fintrack.exe" (
  copy "src-tauri\target\release\fintrack.exe" "FinTrack.exe"
  echo EXE built successfully!
) else (
  echo EXE not found!
)
