package com.booking.appointmentservice.service;

import com.booking.appointmentservice.model.Appointment;
import com.booking.appointmentservice.model.AppointmentStatus;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface AppointmentService {
    
    // Basic CRUD operations
    List<Appointment> getAllAppointments();
    
    Optional<Appointment> getAppointmentById(Long id);
    
    Appointment bookAppointment(Appointment appointment);
    
    Appointment updateAppointment(Long id, Appointment appointment);
    
    void cancelAppointment(Long id);
    
    // User-specific operations
    List<Appointment> getUserAppointments(Long userId);
    
    List<Appointment> getUserAppointmentsByStatus(Long userId, AppointmentStatus status);
    
    // Doctor-specific operations
    List<Appointment> getDoctorAppointments(Long doctorId);
    
    List<Appointment> getDoctorAppointmentsByDate(Long doctorId, LocalDate date);
    
    List<Appointment> getDoctorAppointmentsByStatus(Long doctorId, AppointmentStatus status);
    
    // Availability check
    boolean isTimeSlotAvailable(Long doctorId, LocalDate date, LocalTime startTime, LocalTime endTime);
    
    // Status management
    Appointment updateAppointmentStatus(Long id, AppointmentStatus status);
}