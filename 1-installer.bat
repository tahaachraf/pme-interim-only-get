@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo === PME Interim DEMO - Installation ===
where node >nul 2>nul || (echo Node.js est introuvable. Installez la version LTS depuis nodejs.org puis relancez. & pause & exit /b 1)
if not exist .env (
  copy .env.example .env >nul
  echo Fichier .env cree. Renseignez votre mot de passe PostgreSQL dans DATABASE_URL, enregistrez, puis fermez le Bloc-notes.
  notepad .env
)
call npm install --no-audit --no-fund || (echo Echec de npm install & pause & exit /b 1)
call npm run setup || (echo Echec de la preparation de la base. Verifiez PostgreSQL et .env & pause & exit /b 1)
echo.
echo Installation terminee. Lancez 2-demarrer.bat
pause
