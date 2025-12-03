# syntax=docker/dockerfile:1
FROM amazoncorretto:21-alpine as build

WORKDIR /app
COPY pom.xml .
COPY src ./src

# instalăm maven, build + package
RUN apk add --no-cache maven && mvn -q -DskipTests package

FROM amazoncorretto:21-alpine
WORKDIR /app

# copiem JAR-ul final
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]