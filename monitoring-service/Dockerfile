# Stage 1: Build Application (Folosind Amazon Corretto 21 + Maven)
FROM amazoncorretto:21-alpine as build

# Instalare Maven pentru a rula comanda de build
RUN apk add --no-cache maven

WORKDIR /app

# 1. Copiem pom.xml
COPY pom.xml .

# 2. Copiem codul sursa
COPY src ./src

# 3. Compilam si impachetam in JAR (ignorand testele)
# Folosim -q (quiet) pentru output mai curat, dar rulam comanda completa
RUN mvn -q clean install -DskipTests

# Stage 2: Create Final Runtime Image (Folosind doar JRE 21 Corretto, care e mai mica)
FROM amazoncorretto:21-alpine

WORKDIR /app

# Seteaza portul intern
EXPOSE 8084

# 4. Copiem JAR-ul final din stage-ul de build
COPY --from=build /app/target/*.jar app.jar

# 5. Defineste comanda de rulare
ENTRYPOINT ["java", "-jar", "app.jar"]