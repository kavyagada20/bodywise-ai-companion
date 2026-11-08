@echo off
echo Starting Bodywise AI Companion FastAPI Backend on http://localhost:8000 ...
cd backend
call venv\Scripts\activate.bat
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

