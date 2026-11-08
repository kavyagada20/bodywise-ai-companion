# PowerShell launch script for Bodywise AI Companion
Write-Host "==========================================================" -ForegroundColor Magenta
Write-Host "  Starting Bodywise AI Companion — Full-Stack Application  " -ForegroundColor Magenta
Write-Host "==========================================================" -ForegroundColor Magenta

# Launch Backend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Starting FastAPI Backend...' -ForegroundColor Cyan; cd '$PSScriptRoot\backend'; .\venv\Scripts\python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

# Launch Frontend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Starting Next.js Frontend...' -ForegroundColor Green; cd '$PSScriptRoot\frontend'; npm run dev"

Write-Host ""
Write-Host "Both processes launched!" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "Backend:  http://localhost:8000 (API Docs: http://localhost:8000/docs)" -ForegroundColor Cyan
Write-Host ""

