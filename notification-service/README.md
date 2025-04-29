# Notification Service

This service is responsible for sending email notifications for appointment events in the Online Appointment Booking System. It uses Kafka to consume events from other services and sends appropriate email notifications.

## Features

- Email notifications for appointment events
- Kafka integration for asynchronous event processing
- Support for different notification types:
  - Appointment confirmation
  - Appointment reminders
  - Appointment cancellations
  - Generic email notifications

## Technology Stack

- Java 17
- Spring Boot 3.x
- Spring Kafka
- Spring Mail
- Lombok

## Setup Instructions

### Prerequisites

- JDK 17+
- Gradle
- Kafka (running locally or accessible instance)
- SMTP server access (for email sending)

### Configuration

1. Update `application.properties` with your email credentials:

```properties
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

2. Configure Kafka connection (if not using default localhost:9092):

```properties
spring.kafka.bootstrap-servers=your-kafka-server:9092
```

### Running the Service

```bash
./gradlew bootRun
```

The service will start on port 8082 by default.

## Kafka Topics

The service listens to the following Kafka topics:

- `appointment-created` - When a new appointment is booked
- `appointment-reminder` - When a reminder needs to be sent
- `appointment-cancelled` - When an appointment is cancelled

## API Endpoints

- `POST /api/notifications/email` - Send a generic email
- `POST /api/notifications/appointment-confirmation` - Send appointment confirmation
- `POST /api/notifications/appointment-reminder` - Send appointment reminder
- `POST /api/notifications/appointment-cancellation` - Send appointment cancellation

## Integration with Other Services

This service is designed to work with the Appointment Service, which publishes events to Kafka when appointments are created, updated, or cancelled.