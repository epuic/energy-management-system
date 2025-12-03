# Energy Management System – Distributed Microservices Platform

A full microservices-based **Energy Management System** designed to manage users, smart metering devices, and authentication flows. The system is built with **independent containerized services**, each with its own database, and exposed through a secure **API Gateway** enforcing authentication, authorization, and routing rules.  
This project demonstrates skills in **distributed architectures, REST APIs, role-based access, Docker deployment, and secure backend communication**.

---

## 🚀 Features

### 👤 User Roles & Authentication
- Secure login & registration using **JWT**
- **Role-based access control** (Admin & Client)
- API Gateway with token validation and permission checks
- Secure credential storage and session management

### 🧩 Microservices
- **Authentication Service** – login, registration, token issuing  
- **User Service** – CRUD operations for users  
- **Device Service** – CRUD operations for devices & device–user mapping  
- Each service has **its own database** for isolation and scalability

### 🌐 Frontend
- Built with **ReactJS**
- Admin dashboard:
  - CRUD for users
  - CRUD for devices
  - Assign devices to users
- Client dashboard:
  - View assigned devices and consumption limits

### 🛡️ API Gateway & Reverse Proxy
- Implemented using **Traefik**
- Routes all requests to correct services
- Enforces authentication and security policies
- Validates requests before forwarding

### 🐳 Docker Deployment
- Fully containerized platform using **Docker**
- Docker Compose orchestrates:
  - Microservices
  - Databases
  - API Gateway
  - Frontend

---

## 🏗️ Architecture Overview

High-level system design:
- ReactJS Frontend → API Gateway → Microservices → Databases  
- Communication is done via **REST**  
- Stateless JWT authentication between frontend and backend  

Architecture benefits:
- Independent deployment  
- Loose coupling  
- Scalability  
- Maintainability  

---

## 🛠️ Technologies Used

### Backend
- **Java Spring Boot**
- REST API (Controller → Service → Repository)
- ORM (JPA / Hibernate)
- JWT Authentication
- Role-based authorization

### Frontend
- **ReactJS**
- Axios & API integration
- Protected routes & role-based UI
- Form handling and validation

### Databases
- **MySQL / PostgreSQL**
- One database per microservice:
  - User Database
  - Device Database
  - Credential Database

### Infrastructure
- **Docker** & Docker Compose
- **Traefik** API Gateway
- Environment-based configuration

---

## ▶️ How to Run the Project

### 1. Clone the repository
```bash
git clone https://github.com/your-username/energy-management-system.git
cd energy-management-system
