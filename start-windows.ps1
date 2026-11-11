# AI SAMRAT Assessment Hub - Windows PowerShell Launcher
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "          AI SAMRAT ASSESSMENT HUB - ENTERPRISE PLATFORM" -ForegroundColor Cyan
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Get-Command java -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Java is not detected in your system PATH." -ForegroundColor Red
    Write-Host "Please install Java 17 or Java 21 from: https://adoptium.net/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit..."
    exit 1
}

Write-Host "Java environment verified." -ForegroundColor Green
Write-Host "Starting application server on http://localhost:8080 ..." -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server at any time." -ForegroundColor Gray
Write-Host ""

Start-Job -ScriptBlock {
    Start-Sleep -Seconds 5
    Start-Process "http://localhost:8080"
} | Out-Null

$jarPath = "examhub-app.jar"
if (-not (Test-Path $jarPath)) {
    $jarPath = "backend\target\examhub-backend-1.0.0.jar"
}

if (Test-Path $jarPath) {
    java -jar $jarPath
} else {
    Write-Host "[ERROR] Could not find executable JAR file." -ForegroundColor Red
    Read-Host "Press Enter to exit..."
}

