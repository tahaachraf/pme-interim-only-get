@echo off
chcp 65001 >nul
cd /d "%~dp0"
start "" cmd /c "timeout /t 6 >nul & start http://localhost:5000"
call npm run dev
pause
