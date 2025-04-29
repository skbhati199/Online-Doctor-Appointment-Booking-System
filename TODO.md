## ✅ `TODO.md` – Online Appointment Booking System (Java Full Stack, Kafka, Microservices, Docker, Kubernetes)

---

### 🎯 **Project Goal**
Build a scalable Online Appointment Booking System to solve clinic booking chaos using a microservices-based architecture.

---

### 🏗️ **Architecture Overview**
```
Frontend (React.js)
      |
API Gateway (Spring Cloud Gateway)
      |
+-----------------------------+
|        Backend (Spring Boot Microservices)         |
|                                                    |
| - User Service (Login/Register/Profile)            |
| - Appointment Service (Book/View/Cancel)           |
| - Doctor Service (Schedules/Specializations)       |
| - Notification Service (SMS/Email via Kafka)       |
| - Admin Service (Manage users, doctors, slots)     |
+----------------------------------------------------+
                |
            PostgreSQL / MongoDB
                |
        Kafka for async events (e.g. notifications)
```

---

### 📦 **Microservices TODO**

#### User Service
- ✅ Create Spring Boot project
- ✅ Implement user registration and login (JWT auth)
- ✅ Role-based access (Patient, Doctor, Admin)
- ✅ Connect with PostgreSQL (JPA + Hibernate)
- ✅ API endpoints: `/register`, `/login`, `/profile`

#### Doctor Service
- ✅ Create doctor model (name, specialization, timings)
- ✅ CRUD endpoints for managing doctors (Admin access)
- ✅ Fetch doctor list with filters (specialization/date)

#### Appointment Service
- ✅ Create appointment entity (userId, doctorId, slot, status)
- ✅ Implement booking logic with conflict checking
- ✅ Appointment reschedule and cancel
- ✅ Emit Kafka event after successful booking

#### Notification Service
- ✅ Listen to Kafka `appointment-topic`
- ✅ Send email/SMS using external API
- ✅ Implement retry mechanism with Kafka consumer

#### Admin Service
- [ ] Manage doctors, appointments, users
- [ ] Dashboard analytics (optional)

---

### 🔀 **Kafka TODO**
- [x] Setup Kafka broker locally (via Docker)
- [x] Define topics: `appointment-created`, `appointment-cancelled`
- [x] Producer in Appointment Service
- [x] Consumer in Notification Service

---

### 🌐 **API Gateway (Spring Cloud Gateway)**
- [x] Route external requests to internal services
- [x] JWT auth verification
- [ ] Rate limiting / throttling (optional)

---

### 💻 **Frontend TODO (React.js)**
- [ ] Authentication (Login/Register UI)
- [ ] Browse doctors and filter by date/specialization
- [ ] Book/cancel/reschedule appointment
- [ ] User dashboard (history, upcoming appointments)
- [ ] Admin panel

---

### 🐳 **Docker TODO**
- [x] Dockerize each microservice
- [x] Create Dockerfile for:
    - [x] Notification Service
    - [x] Appointment Service
    - [ ] User Service
    - [ ] Doctor Service
    - [ ] Admin Service
    - [x] Kafka + Zookeeper
    - [ ] PostgreSQL
    - [x] Frontend
    - [x] API Gateway
- [x] Use Docker Compose for local development (Kafka, Zookeeper, Notification, Appointment, API Gateway, Frontend)
- [ ] Complete Docker Compose with remaining services (User, Doctor, Admin)

---

### ☸️ **Kubernetes TODO**
- [x] Write Deployment YAMLs for Notification Service
- [x] Configure Services for Notification Service
- [x] Setup ConfigMaps / Secrets for Notification Service
- [x] Write Deployment YAMLs for API Gateway
- [x] Configure Services for API Gateway
- [x] Create Ingress for API Gateway
- [x] Write Deployment YAMLs for Frontend
- [x] Configure Services for Frontend
- [ ] Write Deployment YAMLs for remaining services (User, Doctor, Admin, Appointment)
- [ ] Configure Services for remaining services
- [ ] Setup ConfigMaps / Secrets for remaining services
- [x] Health checks and resource limits for deployed services
- [ ] Use Helm Charts (optional for packaging)

---

### 📚 **Optional Enhancements**
- [ ] Rate limiting (Spring Cloud Gateway + Redis)
- [ ] Role-based dashboards
- [ ] Audit logs (Kafka + MongoDB)
- [ ] CI/CD pipeline with Jenkins or GitHub Actions

---

### 📝 **Next Steps**

1. Complete Docker configurations for remaining services (User, Doctor, Admin)
2. Implement Kubernetes configurations for other services
3. Develop React frontend components for:
   - User authentication
   - Doctor listing and filtering
   - Appointment booking and management
   - Admin dashboard
4. Implement integration tests between services
5. Add rate limiting to API Gateway using Redis
6. Set up CI/CD pipeline for automated deployment