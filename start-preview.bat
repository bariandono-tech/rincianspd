@echo off
cd /d "%~dp0"
echo Starting dev server...
start cmd /k "npm run dev"
timeout /t 3 /nobreak
start chrome http://localhost:3000
