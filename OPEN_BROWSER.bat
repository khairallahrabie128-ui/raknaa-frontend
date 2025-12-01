@echo off
chcp 65001 >nul
echo ========================================
echo   Opening Browser...
echo ========================================
echo.

REM Use PowerShell to open browser (most reliable method)
powershell -Command "Start-Process 'http://localhost:3000/dashboard/owner'"

timeout /t 2 /nobreak >nul

REM Also try direct method
start "" "http://localhost:3000/dashboard/owner"

echo.
echo ✓ Browser should be open now!
echo.
echo If browser didn't open, manually go to:
echo http://localhost:3000/dashboard/owner
echo.

pause

