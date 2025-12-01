@echo off
chcp 65001 >nul
title Installing Dependencies
cls
echo ========================================
echo   Installing Dependencies
echo ========================================
echo.

cd /d "%~dp0"

echo This will install all required packages.
echo It may take 2-5 minutes...
echo.
pause

npm install

if errorlevel 1 (
    echo.
    echo [ERROR] Installation failed!
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Installation Complete!
echo ========================================
echo.
echo You can now run START.bat to start the server
echo.
pause

