@echo off
setlocal
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\start-student-package.ps1"
if errorlevel 1 (
    echo.
    echo Sequel Detective could not start. Review the message above or send it to your instructor.
    pause
)
