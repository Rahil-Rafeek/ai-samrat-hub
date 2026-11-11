# ===================================================
# AI SAMRAT ASSESSMENT HUB - BACKEND DOCKERFILE
# Multi-stage Java 21 LTS / Spring Boot 3.x Build
# ===================================================

# Stage 1: Build JAR with Maven and OpenJDK 21
FROM amazoncorretto:21-alpine AS builder
WORKDIR /workspace

# Install maven
RUN apk add --no-cache maven

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B || true

# Copy source code and resources
COPY src ./src

# Compile and package application (skip surefire tests in docker layer for fast image assembly)
RUN mvn clean package -DskipTests -B

# Stage 2: Minimal Production Runtime
FROM amazoncorretto:21-alpine
WORKDIR /app

# Add unprivileged system user
RUN addgroup -S aisamrat && adduser -S aisamrat -G aisamrat

# Create data and certificates directory
RUN mkdir -p /app/data /app/certificates && chown -R aisamrat:aisamrat /app

# Copy executable jar from builder stage
COPY --from=builder /workspace/target/examhub-backend-1.0.0.jar app.jar
RUN chown aisamrat:aisamrat app.jar

USER aisamrat

EXPOSE 8080

# Configure production JVM flags: container memory awareness, GC tuning
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+UseG1GC -Djava.security.egd=file:/dev/./urandom"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]

