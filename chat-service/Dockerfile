# Stage 1: Build Application (Folosind Amazon Corretto 21 + Maven)
FROM amazoncorretto:21-alpine as build

# Instalare Maven pentru a rula comanda de build
RUN apk add --no-cache maven

WORKDIR /app

# 1. Copiem pom.xml pentru dependinte (Spring Web, Websocket, etc.)
COPY pom.xml .

# 2. Copiem codul sursa (include controller-ul de chat si chatbot-ul rule-based)
COPY src ./src

# 3. Compilam si impachetam in JAR (ignorand testele)
RUN mvn -q clean install -DskipTests

# Stage 2: Create Final Runtime Image
FROM amazoncorretto:21-alpine

WORKDIR /app

# Portul pentru chat-service (folosit in WebSocketConfig)
EXPOSE 8085

# 4. Copiem JAR-ul final din stage-ul de build
COPY --from=build /app/target/*.jar app.jar

# 5. Defineste comanda de rulare
ENTRYPOINT ["java", "-jar", "app.jar"]