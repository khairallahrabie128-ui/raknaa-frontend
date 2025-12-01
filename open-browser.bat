@echo off
chcp 65001 >nul
echo Opening browser...
echo.

REM Method 1: PowerShell (most reliable)
powershell -Command "Start-Process 'http://localhost:3000/dashboard/owner'"
timeout /t 1 /nobreak >nul

REM Method 2: Direct start
start "" "http://localhost:3000/dashboard/owner"
timeout /t 1 /nobreak >nul

REM Method 3: Try Chrome
where chrome >nul 2>&1
if not errorlevel 1 (
    start chrome "http://localhost:3000/dashboard/owner"
    echo ✓ Opened with Chrome
    exit /b 0
)

REM Method 4: Try Edge
where msedge >nul 2>&1
if not errorlevel 1 (
    start msedge "http://localhost:3000/dashboard/owner"
    echo ✓ Opened with Edge
    exit /b 0
)

REM Method 5: Try Firefox
where firefox >nul 2>&1
if not errorlevel 1 (
    start firefox "http://localhost:3000/dashboard/owner"
    echo ✓ Opened with Firefox
    exit /b 0
)

REM Fallback: Default browser
start "http://localhost:3000/dashboard/owner"
echo ✓ Opened with default browser

