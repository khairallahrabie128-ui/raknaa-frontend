
@echo off
chcp 65001 >nul
title Rakna Frontend Setup
cls
echo ========================================
echo   Rakna Frontend - Setup and Run
echo ========================================
echo.

cd /d "%~dp0"

REM Check Node.js
echo [1/4] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org
    echo.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js %NODE_VERSION% is installed
echo.

REM Install dependencies
echo [2/4] Installing dependencies...
echo This may take a few minutes...
echo.
call npm install
if errorlevel 1 (
    echo.
    echo [ERROR] Failed to install dependencies
    echo.
    pause
    exit /b 1
)
echo.
echo [OK] Dependencies installed successfully
echo.

REM Clean cache
echo [3/4] Cleaning cache...
if exist ".next" (
    rmdir /s /q .next
    echo [OK] Cache cleaned
) else (
    echo [OK] No cache to clean
)
echo.

REM Start server
echo [4/4] Starting development server...
echo.
echo ========================================
echo   Server starting...
echo   Browser will open automatically
echo ========================================
echo.

REM Start server in background
start "Next.js Server" cmd /k "npm run dev"

REM Wait for server
echo Waiting for server to start (15 seconds)...
timeout /t 15 /nobreak >nul

REM Open browser
echo.
echo Opening browser...
powershell -Command "Start-Process 'http://localhost:3000/dashboard/owner'"
timeout /t 1 /nobreak >nul
start "" "http://localhost:3000/dashboard/owner"

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Server is running in: "Next.js Server" window
echo Browser should be open now
echo.
echo If browser didn't open, go to:
echo http://localhost:3000/dashboard/owner
echo.
echo To stop server: Close "Next.js Server" window
echo.

pause

