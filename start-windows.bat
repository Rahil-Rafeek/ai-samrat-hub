@echo off
title AI SAMRAT Assessment Hub - Windows Launcher
color 0B
echo =====================================================================
echo           AI SAMRAT ASSESSMENT HUB - ENTERPRISE PLATFORM
echo =====================================================================
echo.
echo Checking Java Environment...
where java >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Java is not detected in your system PATH.
    echo Please install Java 17 or Java 21 from:
    echo https://adoptium.net/temurin/releases/?version=21
    echo or Amazon Corretto:
    echo https://docs.aws.amazon.com/corretto/latest/corretto-21-ug/downloads-list.html
    echo.
    pause
    exit /b 1
)

echo Java is detected:
java -version
echo.
echo Starting AI SAMRAT Assessment Hub on http://localhost:8080 ...
echo Press Ctrl+C in this terminal window to stop the server at any time.
echo.

REM Automatically launch the browser after 5 seconds delay
start "" cmd /c "timeout /t 5 >nul && start http://localhost:8080"

REM Launch the backend JAR (which includes the built frontend, database, and 600 MCQs)
if exist "examhub-app.jar" (
    java -jar examhub-app.jar
) else if exist "backend\target\examhub-backend-1.0.0.jar" (
    java -jar backend\target\examhub-backend-1.0.0.jar
) else (
    echo [ERROR] Could not find executable JAR file.
    pause
)

