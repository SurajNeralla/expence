@echo off
echo ================================================
echo  Expense Tracker - Setup Script
echo ================================================
echo.

echo [1/4] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
  echo ERROR: Node.js is not installed!
  echo Please download and install Node.js from https://nodejs.org
  echo Then run this script again.
  pause
  exit /b 1
)
echo Node.js found!
echo.

echo [2/4] Installing dependencies...
npm install
if %errorlevel% neq 0 (
  echo ERROR: npm install failed!
  pause
  exit /b 1
)
echo Dependencies installed!
echo.

echo [3/4] Checking environment file...
if not exist .env.local (
  copy .env.example .env.local
  echo Created .env.local from template.
  echo.
  echo IMPORTANT: Open .env.local and add your Supabase credentials!
  echo   VITE_SUPABASE_URL=your_project_url
  echo   VITE_SUPABASE_ANON_KEY=your_anon_key
  echo.
  echo Get these from: https://supabase.com ^> Your Project ^> Settings ^> API
  echo.
  pause
) else (
  echo .env.local already exists.
)

echo [4/4] Starting development server...
echo.
echo App will open at: http://localhost:5173
echo.
npm run dev
