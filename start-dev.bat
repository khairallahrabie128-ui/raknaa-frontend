@echo off
echo ====================================
echo Starting Rakna Frontend Development
echo ====================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
)

REM Remove cache
if exist ".next" (
    echo Removing cache...
    rmdir /s /q .next
    echo.
)

echo Starting development server...
echo.
echo Open: http://localhost:3000/dashboard/owner
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev

pause

