package com.booking.notificationservice.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@Slf4j
public class KafkaConsumerService {

    private final EmailService emailService;
    private final ObjectMapper objectMapper;

    @Autowired
    public KafkaConsumerService(EmailService emailService, ObjectMapper objectMapper) {
        this.emailService = emailService;
        this.objectMapper = objectMapper;
    }

    @KafkaListener(topics = "appointment-created", groupId = "${spring.kafka.consumer.group-id}")
    public void handleAppointmentCreated(Map<String, Object> appointmentData) {
        try {
            log.info("Received appointment creation event: {}", appointmentData);
            String email = (String) appointmentData.get("patientEmail");
            String doctorName = (String) appointmentData.get("doctorName");
            String appointmentDate = (String) appointmentData.get("appointmentDate");
            String appointmentTime = (String) appointmentData.get("appointmentTime");
            
            emailService.sendAppointmentConfirmation(email, doctorName, appointmentDate, appointmentTime);
        } catch (Exception e) {
            log.error("Error processing appointment creation event", e);
        }
    }

    @KafkaListener(topics = "appointment-reminder", groupId = "${spring.kafka.consumer.group-id}")
    public void handleAppointmentReminder(Map<String, Object> appointmentData) {
        try {
            log.info("Received appointment reminder event: {}", appointmentData);
            String email = (String) appointmentData.get("patientEmail");
            String doctorName = (String) appointmentData.get("doctorName");
            String appointmentDate = (String) appointmentData.get("appointmentDate");
            String appointmentTime = (String) appointmentData.get("appointmentTime");
            
            emailService.sendAppointmentReminder(email, doctorName, appointmentDate, appointmentTime);
        } catch (Exception e) {
            log.error("Error processing appointment reminder event", e);
        }
    }

    @KafkaListener(topics = "appointment-cancelled", groupId = "${spring.kafka.consumer.group-id}")
    public void handleAppointmentCancelled(Map<String, Object> appointmentData) {
        try {
            log.info("Received appointment cancellation event: {}", appointmentData);
            String email = (String) appointmentData.get("patientEmail");
            String doctorName = (String) appointmentData.get("doctorName");
            String appointmentDate = (String) appointmentData.get("appointmentDate");
            String appointmentTime = (String) appointmentData.get("appointmentTime");
            
            emailService.sendAppointmentCancellation(email, doctorName, appointmentDate, appointmentTime);
        } catch (Exception e) {
            log.error("Error processing appointment cancellation event", e);
        }
    }
}