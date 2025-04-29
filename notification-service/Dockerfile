FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copy gradle files
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

# Copy source code
COPY src src

# Make gradlew executable
RUN chmod +x ./gradlew

# Build the application
RUN ./gradlew build -x test

# Extract the built JAR
RUN mkdir -p build/extracted && \
    java -Djarmode=layertools -jar build/libs/*.jar extract --destination build/extracted

# Create the final image
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy layers from the build stage
COPY --from=0 /app/build/extracted/dependencies/ ./
COPY --from=0 /app/build/extracted/spring-boot-loader/ ./
COPY --from=0 /app/build/extracted/snapshot-dependencies/ ./
COPY --from=0 /app/build/extracted/application/ ./

# Set the entrypoint
ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]