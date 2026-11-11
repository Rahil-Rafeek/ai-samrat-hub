#!/usr/bin/env bash
echo "====================================================================="
echo "          AI SAMRAT ASSESSMENT HUB - ENTERPRISE PLATFORM"
echo "====================================================================="
echo ""

if ! command -v java &> /dev/null; then
    echo "[ERROR] Java is not installed or not in PATH."
    echo "Please install Java 17 or Java 21."
    exit 1
fi

echo "Starting server on http://localhost:8080 ..."
(sleep 4 && (open http://localhost:8080 2>/dev/null || xdg-open http://localhost:8080 2>/dev/null)) &

if [ -f "examhub-app.jar" ]; then
    java -jar examhub-app.jar
elif [ -f "backend/target/examhub-backend-1.0.0.jar" ]; then
    java -jar backend/target/examhub-backend-1.0.0.jar
else
    echo "[ERROR] Could not find executable JAR file."
    exit 1
fi

