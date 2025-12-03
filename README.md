# Energy Management System – Distributed Microservices Platform

This project implements a distributed, containerized Energy Management System built using independent microservices, each responsible for a specific domain of the platform. All backend services communicate through REST APIs and are exposed via an API Gateway that enforces authentication, authorization, and request routing. The system demonstrates clean backend architecture, secure communication using JWT, full-stack integration, and deployment with Docker.

---

## Features

### User Roles and Authentication
- Secure login and registration using JWT
- Role-based access control (Admin and Client)
- API Gateway performs token validation and permission checks
- Secure credential handling and stateless communication

### Microservices
- Authentication Service: handles login, register, and token issuance
- User Service: CRUD operations for user accounts
- Device Service: CRUD operations for devices and mapping between users and devices
- Each microservice has its own PostgreSQL database for isolation and reliability

### Frontend Application
- Built using ReactJS
- Admin dashboard:
  - User management (create, update, delete)
  - Device management (create, update, delete)
  - Assigning devices to users
- Client dashboard:
  - Viewing assigned devices and their details

### API Gateway and Reverse Proxy
- Implemented using Traefik
- Central entry point for all requests
- Routes traffic to the correct service
- Applies authentication and authorization rules

### Docker Deployment
- Full platform runs in isolated containers
- Docker Compose orchestrates:
  - Backend microservices
  - PostgreSQL databases
  - API Gateway
  - Frontend

---

## Architecture Overview

The system follows a distributed architecture pattern with the following communication flow:
- ReactJS Frontend communicates with the API Gateway
- API Gateway routes authenticated requests to the appropriate microservice
- Microservices connect to dedicated PostgreSQL databases
- Stateless authentication with JWT ensures scalable, secure communications

This architecture supports:
- Independent service deployment
- Loose coupling between components
- Scalability and maintainability
- Fault isolation between services

---

## Technologies Used

### Backend
- Java Spring Boot
- REST API architecture
- JPA / Hibernate ORM
- JWT-based authentication
- Role-based authorization

### Frontend
- ReactJS
- Axios for API communication
- Protected routes based on user role
- Dynamic UI rendering for Admin and Client

### Databases
- PostgreSQL
- One database per microservice:
  - User Database
  - Device Database
  - Credentials Database

### Infrastructure
- Docker and Docker Compose
- Traefik API Gateway
- Environment variable configuration for containerized services

![descriere](/diagram.png)

---

