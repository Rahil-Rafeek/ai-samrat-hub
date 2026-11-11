# ===================================================
# AI SAMRAT ASSESSMENT HUB - PRODUCTION DOCKERFILE
# Multi-stage Java 21 build for Render, Railway, AWS
# ===================================================

# Stage 1: Build executable JAR from source
FROM amazoncorretto:21-alpine AS builder
WORKDIR /workspace
RUN apk add --no-cache maven

# Cache dependencies
COPY backend/pom.xml .
RUN mvn dependency:go-offline -B || true

# Copy source and bundled frontend assets
COPY backend/src ./src

# Build production JAR (skipping unit tests for fast cloud container assembly)
RUN mvn clean package -DskipTests -B

# Stage 2: Ultra-light Production Runtime
FROM amazoncorretto:21-alpine-jre
WORKDIR /app

# Add unprivileged application user
RUN addgroup -S aisamrat && adduser -S aisamrat -G aisamrat
RUN mkdir -p /app/data /app/certificates && chown -R aisamrat:aisamrat /app

# Copy built JAR from builder stage
COPY --from=builder /workspace/target/examhub-backend-1.0.0.jar app.jar
RUN chown aisamrat:aisamrat app.jar

USER aisamrat

ENV PORT=8080
EXPOSE 8080

# Production memory management: Auto-tune to cloud RAM container limits
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+UseG1GC -Djava.security.egd=file:/dev/./urandom"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT:-8080} -jar app.jar"]
