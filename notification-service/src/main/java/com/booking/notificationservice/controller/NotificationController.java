package com.booking.notificationservice.controller;

import com.booking.notificationservice.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final EmailService emailService;

    @Autowired
    public NotificationController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/email")
    public ResponseEntity<String> sendEmail(@RequestBody Map<String, String> emailRequest) {
        try {
            String to = emailRequest.get("to");
            String subject = emailRequest.get("subject");
            String body = emailRequest.get("body");
            
            emailService.sendEmail(to, subject, body);
            return ResponseEntity.ok("Email sent successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to send email: " + e.getMessage());
        }
    }

    @PostMapping("/appointment-confirmation")
    public ResponseEntity<String> sendAppointmentConfirmation(@RequestBody Map<String, String> confirmationRequest) {
        try {
            String to = confirmationRequest.get("to");
            String doctorName = confirmationRequest.get("doctorName");
            String appointmentDate = confirmationRequest.get("appointmentDate");
            String appointmentTime = confirmationRequest.get("appointmentTime");
            
            emailService.sendAppointmentConfirmation(to, doctorName, appointmentDate, appointmentTime);
            return ResponseEntity.ok("Confirmation email sent successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to send confirmation email: " + e.getMessage());
        }
    }

    @PostMapping("/appointment-reminder")
    public ResponseEntity<String> sendAppointmentReminder(@RequestBody Map<String, String> reminderRequest) {
        try {
            String to = reminderRequest.get("to");
            String doctorName = reminderRequest.get("doctorName");
            String appointmentDate = reminderRequest.get("appointmentDate");
            String appointmentTime = reminderRequest.get("appointmentTime");
            
            emailService.sendAppointmentReminder(to, doctorName, appointmentDate, appointmentTime);
            return ResponseEntity.ok("Reminder email sent successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to send reminder email: " + e.getMessage());
        }
    }

    @PostMapping("/appointment-cancellation")
    public ResponseEntity<String> sendAppointmentCancellation(@RequestBody Map<String, String> cancellationRequest) {
        try {
            String to = cancellationRequest.get("to");
            String doctorName = cancellationRequest.get("doctorName");
            String appointmentDate = cancellationRequest.get("appointmentDate");
            String appointmentTime = cancellationRequest.get("appointmentTime");
            
            emailService.sendAppointmentCancellation(to, doctorName, appointmentDate, appointmentTime);
            return ResponseEntity.ok("Cancellation email sent successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to send cancellation email: " + e.getMessage());
        }
    }
}