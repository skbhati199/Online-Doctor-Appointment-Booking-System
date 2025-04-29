package com.booking.notificationservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Model class representing an appointment event received from Kafka
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentEvent {
    private Long appointmentId;
    private Long patientId;
    private String patientEmail;
    private Long doctorId;
    private String doctorName;
    private String appointmentDate;
    private String appointmentTime;
    private String status;
}