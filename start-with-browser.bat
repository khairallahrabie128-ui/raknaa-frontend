@echo off
chcp 65001 >nul
title Rakna Frontend - Auto Start
echo ========================================
echo   Rakna Frontend - Auto Start
echo ========================================
echo.

cd /d "%~dp0"

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)
echo [OK] Node.js is installed

REM Install dependencies if needed
if not exist "node_modules" (
    echo [1/3] Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
) else (
    echo [OK] Dependencies already installed
)

REM Clean cache
if exist ".next" (
    echo [2/3] Cleaning cache...
    rmdir /s /q .next
) else (
    echo [OK] No cache to clean
)

echo.
echo [3/3] Starting server...
echo Browser will open automatically in 8 seconds...
echo.

REM Start server in new window
start "Next.js Dev Server" cmd /k "npm run dev"

REM Wait for server to be ready
echo Waiting for server to start (10 seconds)...
timeout /t 10 /nobreak >nul

REM Wait a bit more for server to fully start
echo Waiting for server to be fully ready...
timeout /t 5 /nobreak >nul

REM Open browser - try multiple methods
echo Opening browser...
echo.

REM Method 1: PowerShell (most reliable)
powershell -Command "Start-Process 'http://localhost:3000/dashboard/owner'"

REM Wait a moment
timeout /t 2 /nobreak >nul

REM Method 2: Direct start command
start "" "http://localhost:3000/dashboard/owner"

REM Method 3: Try Chrome if available
where chrome >nul 2>&1
if not errorlevel 1 (
    start chrome "http://localhost:3000/dashboard/owner"
    echo ✓ Opened with Chrome
) else (
    REM Method 4: Try Edge if available
    where msedge >nul 2>&1
    if not errorlevel 1 (
        start msedge "http://localhost:3000/dashboard/owner"
        echo ✓ Opened with Edge
    )
)

echo.
echo ========================================
echo   ✓ Server started!
echo   ✓ Browser opened!
echo ========================================
echo.
echo Server is running in: "Next.js Dev Server" window
echo To stop: Close the "Next.js Dev Server" window
echo.
echo URL: http://localhost:3000/dashboard/owner
echo.

pause

