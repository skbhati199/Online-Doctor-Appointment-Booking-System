package com.booking.appointmentservice.model;

public enum AppointmentStatus {
    SCHEDULED,    // Initial status when appointment is booked
    CONFIRMED,    // When doctor confirms the appointment
    COMPLETED,    // After the appointment is done
    CANCELLED,    // When patient cancels the appointment
    NO_SHOW,      // When patient doesn't show up
    RESCHEDULED   // When appointment is moved to a different time
}