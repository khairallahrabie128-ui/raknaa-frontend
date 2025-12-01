@echo off
chcp 65001 >nul
title Rakna Frontend
cls
echo ========================================
echo   Rakna Frontend
echo ========================================
echo.

cd /d "%~dp0"

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed!
    echo Download from: https://nodejs.org
    pause
    exit /b 1
)

REM Install if needed
if not exist "node_modules" (
    echo Installing dependencies...
    echo Please wait, this may take a few minutes...
    echo.
    npm install
    if errorlevel 1 (
        echo.
        echo [ERROR] Installation failed!
        pause
        exit /b 1
    )
    echo.
    echo Installation complete!
    echo.
)

REM Clean cache
if exist ".next" rmdir /s /q .next >nul 2>&1

REM Start
echo Starting server...
echo.
start "Next.js" cmd /k "npm run dev"

timeout /t 15 /nobreak >nul

echo Opening browser...
start "" "http://localhost:3000/dashboard/owner"
powershell -Command "Start-Process 'http://localhost:3000/dashboard/owner'"

echo.
echo Done! Check the "Next.js" window for server status.
echo URL: http://localhost:3000/dashboard/owner
echo.
pause

