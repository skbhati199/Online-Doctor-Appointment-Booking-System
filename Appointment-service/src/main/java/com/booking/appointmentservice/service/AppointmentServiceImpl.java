package com.booking.appointmentservice.service;

import com.booking.appointmentservice.model.Appointment;
import com.booking.appointmentservice.model.AppointmentStatus;
import com.booking.appointmentservice.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;

    @Autowired
    public AppointmentServiceImpl(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    @Override
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    @Override
    public Optional<Appointment> getAppointmentById(Long id) {
        return appointmentRepository.findById(id);
    }

    @Override
    @Transactional
    public Appointment bookAppointment(Appointment appointment) {
        // Check if the time slot is available before booking
        if (!isTimeSlotAvailable(appointment.getDoctorId(), appointment.getDate(), 
                appointment.getStartTime(), appointment.getEndTime())) {
            throw new RuntimeException("The selected time slot is not available");
        }
        
        // Set initial status and save
        appointment.setStatus(AppointmentStatus.SCHEDULED);
        return appointmentRepository.save(appointment);
    }

    @Override
    @Transactional
    public Appointment updateAppointment(Long id, Appointment appointment) {
        return appointmentRepository.findById(id)
                .map(existingAppointment -> {
                    // Check if the new time slot is available (if time is being changed)
                    if (!existingAppointment.getStartTime().equals(appointment.getStartTime()) ||
                        !existingAppointment.getEndTime().equals(appointment.getEndTime()) ||
                        !existingAppointment.getDate().equals(appointment.getDate())) {
                        
                        if (!isTimeSlotAvailable(appointment.getDoctorId(), appointment.getDate(),
                                appointment.getStartTime(), appointment.getEndTime())) {
                            throw new RuntimeException("The selected time slot is not available");
                        }
                    }
                    
                    // Update fields
                    existingAppointment.setDate(appointment.getDate());
                    existingAppointment.setStartTime(appointment.getStartTime());
                    existingAppointment.setEndTime(appointment.getEndTime());
                    existingAppointment.setReason(appointment.getReason());
                    existingAppointment.setStatus(appointment.getStatus());
                    
                    return appointmentRepository.save(existingAppointment);
                })
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));
    }

    @Override
    @Transactional
    public void cancelAppointment(Long id) {
        appointmentRepository.findById(id)
                .map(appointment -> {
                    appointment.setStatus(AppointmentStatus.CANCELLED);
                    return appointmentRepository.save(appointment);
                })
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));
    }

    @Override
    public List<Appointment> getUserAppointments(Long userId) {
        return appointmentRepository.findByUserId(userId);
    }

    @Override
    public List<Appointment> getUserAppointmentsByStatus(Long userId, AppointmentStatus status) {
        return appointmentRepository.findByUserIdAndStatus(userId, status);
    }

    @Override
    public List<Appointment> getDoctorAppointments(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    @Override
    public List<Appointment> getDoctorAppointmentsByDate(Long doctorId, LocalDate date) {
        return appointmentRepository.findActiveDoctorAppointmentsByDate(doctorId, date);
    }

    @Override
    public List<Appointment> getDoctorAppointmentsByStatus(Long doctorId, AppointmentStatus status) {
        return appointmentRepository.findByDoctorIdAndStatus(doctorId, status);
    }

    @Override
    public boolean isTimeSlotAvailable(Long doctorId, LocalDate date, LocalTime startTime, LocalTime endTime) {
        return !appointmentRepository.isTimeSlotBooked(doctorId, date, startTime, endTime);
    }

    @Override
    @Transactional
    public Appointment updateAppointmentStatus(Long id, AppointmentStatus status) {
        return appointmentRepository.findById(id)
                .map(appointment -> {
                    appointment.setStatus(status);
                    return appointmentRepository.save(appointment);
                })
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));
    }
}