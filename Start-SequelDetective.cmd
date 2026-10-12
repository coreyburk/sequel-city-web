@echo off
setlocal
rem One launch: prerequisites, safe database setup, services, then ready browser.
rem Do not inherit PowerShell 7 system-module paths into Windows PowerShell.
set "PSModulePath="
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\start-student-package.ps1"
if errorlevel 1 (
    echo.
    echo Sequel Detective could not start. Review the message above or send it to your instructor.
    pause
)
