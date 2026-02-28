@echo off
REM Start the Next.js app
start "npm run start" cmd /c "npm run start"
REM Wait for the server to start (adjust timeout as needed)
timeout /t 5 /nobreak >nul
REM Open the browser to http://localhost:3000
start "" "http://localhost:3000"
