@echo off
chcp 65001 >nul
title Rakna Frontend
cls
echo ========================================
echo   Rakna Frontend - Quick Start
echo ========================================
echo.

cd /d "%~dp0"

REM Check if node_modules exists
if not exist "node_modules" (
    echo [INFO] Installing dependencies first...
    echo This will take a few minutes...
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo [ERROR] Installation failed!
        pause
        exit /b 1
    )
    echo.
    echo [OK] Dependencies installed!
    echo.
)

REM Clean cache
if exist ".next" (
    rmdir /s /q .next >nul 2>&1
)

echo Starting server...
echo Browser will open automatically...
echo.

REM Start server
start "Next.js Server" cmd /k "npm run dev"

REM Wait for server
echo Waiting 12 seconds for server to start...
timeout /t 12 /nobreak >nul

REM Open browser
echo Opening browser...
powershell -Command "Start-Process 'http://localhost:3000/dashboard/owner'"
timeout /t 1 /nobreak >nul
start "" "http://localhost:3000/dashboard/owner"

echo.
echo ========================================
echo   Server is running!
echo   Browser should be open now
echo ========================================
echo.
echo URL: http://localhost:3000/dashboard/owner
echo.
echo To stop: Close "Next.js Server" window
echo.

pause

