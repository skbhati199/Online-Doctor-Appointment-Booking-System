# Online Appointment Booking System

<p align="center" style="border-radius: 12px;">
  <img style="border-radius: 12px;" src="https://raw.githubusercontent.com/skbhati199/Online-Doctor-Appointment-Booking-System/main/frontend-vite/art/frontend.png" alt="Online Appointment Booking System Cover" width="100%" />
</p>

## Overview
The Online Appointment Booking System is a microservices-based application designed to streamline the process of scheduling and managing appointments. It provides a user-friendly interface for patients to book appointments, reschedule, and cancel them. Doctors can also manage their schedules and receive notifications for upcoming appointments. A microservices-based application for managing doctor appointments, with features for patients to book, reschedule, and cancel appointments, and for doctors to manage their schedules.

## System Architecture

The system is built using a microservices architecture with the following components:

### Core Services

1. **Appointment Service** - Manages appointment scheduling, rescheduling, and cancellation
2. **Notification Service** - Handles email notifications for appointment events
3. **User Service** - Manages user accounts, authentication, and profiles
4. **Doctor Service** - Manages doctor profiles, specialties, and availability

### Technical Components

- **Kafka** - Event streaming platform for asynchronous communication between services
- **API Gateway** - Single entry point for all client requests
- **Docker & Kubernetes** - Containerization and orchestration

## Technology Stack

- **Backend**: Java 17, Spring Boot 3.x
- **Messaging**: Apache Kafka
- **Containerization**: Docker, Kubernetes
- **Database**: PostgreSQL (or your preferred database)

## Service Integration

### Event-Driven Architecture

The system uses an event-driven architecture with Kafka for asynchronous communication:

1. **Appointment Events**:
   - `appointment-created` - When a new appointment is booked
   - `appointment-reminder` - When a reminder needs to be sent
   - `appointment-cancelled` - When an appointment is cancelled

2. **Notification Service** listens to these events and sends appropriate emails

## Setup and Deployment

### Prerequisites

- JDK 17+
- Docker and Docker Compose
- Kubernetes (optional, for production deployment)

### Local Development

1. Start the Kafka infrastructure:
   ```bash
   docker-compose up -d zookeeper kafka
   ```

2. Start each service individually or use Docker Compose:
   ```bash
   docker-compose up
   ```

### Kubernetes Deployment

Each service contains Kubernetes manifests in its `kubernetes/` directory. To deploy:

```bash
kubectl apply -k notification-service/kubernetes/
```

## Service Ports

- Appointment Service: 8081
- Notification Service: 8082
- User Service: 8083 (to be implemented)
- Doctor Service: 8084 (to be implemented)
- API Gateway: 8080 (to be implemented)

## Future Enhancements

- Implement User Service with authentication
- Implement Doctor Service with availability management
- Add API Gateway for unified access
- Implement Admin Dashboard
- Add payment integration