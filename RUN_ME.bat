@echo off
chcp 65001 >nul
echo ========================================
echo   Rakna Frontend - Development Server
echo ========================================
echo.

cd /d "%~dp0"

echo [1/4] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)
echo ✓ Node.js is installed

echo.
echo [2/4] Installing dependencies...
if not exist "node_modules" (
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
) else (
    echo ✓ Dependencies already installed
)

echo.
echo [3/4] Cleaning cache...
if exist ".next" (
    rmdir /s /q .next
    echo ✓ Cache cleaned
) else (
    echo ✓ No cache to clean
)

echo.
echo [4/4] Starting development server...
echo.
echo ========================================
echo   Server will start on:
echo   http://localhost:3000
echo.
echo   Owner Dashboard:
echo   http://localhost:3000/dashboard/owner
echo ========================================
echo.
echo Waiting for server to start...
echo Browser will open automatically in 5 seconds...
echo.

REM Start server in background and wait a bit
start /B npm run dev

REM Wait for server to be ready
timeout /t 8 /nobreak >nul

REM Open browser to owner dashboard
echo Opening browser...
start http://localhost:3000/dashboard/owner

echo.
echo ✓ Browser opened!
echo Press Ctrl+C in this window to stop the server
echo.

REM Keep window open and show server output
call npm run dev

pause

