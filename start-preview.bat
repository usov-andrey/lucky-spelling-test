@echo off
setlocal
cd /d "%~dp0"

set "PYTHON_EXE="
for /d %%D in ("%LocalAppData%\Programs\Python\Python*") do if exist "%%~fD\python.exe" set "PYTHON_EXE=%%~fD\python.exe"
if defined PYTHON_EXE goto start_server

for %%P in (python.exe) do set "PYTHON_EXE=%%~$PATH:P"
if defined PYTHON_EXE goto start_server

where py >nul 2>&1
if not errorlevel 1 goto start_server

echo Python was not found. Install Python or add it to PATH.
pause
exit /b 1

:start_server

echo Lucky Spelling Test local preview
echo Open http://localhost:8000/ in your browser.
echo Press Ctrl+C to stop the server.
echo.

if defined PYTHON_EXE (
  "%PYTHON_EXE%" -m http.server 8000 --bind 127.0.0.1 --directory docs
) else (
  py -3 -m http.server 8000 --bind 127.0.0.1 --directory docs
)

if errorlevel 1 (
  echo.
  echo The preview could not start. Port 8000 may already be in use.
  pause
  exit /b 1
)
