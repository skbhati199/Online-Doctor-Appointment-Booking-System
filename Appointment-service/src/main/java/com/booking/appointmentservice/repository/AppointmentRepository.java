package com.booking.appointmentservice.repository;

import com.booking.appointmentservice.model.Appointment;
import com.booking.appointmentservice.model.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    
    List<Appointment> findByUserId(Long userId);
    
    List<Appointment> findByDoctorId(Long doctorId);
    
    List<Appointment> findByUserIdAndStatus(Long userId, AppointmentStatus status);
    
    List<Appointment> findByDoctorIdAndStatus(Long doctorId, AppointmentStatus status);
    
    List<Appointment> findByDateAndDoctorId(LocalDate date, Long doctorId);
    
    @Query("SELECT a FROM Appointment a WHERE a.doctorId = :doctorId AND a.date = :date AND a.status != 'CANCELLED'")
    List<Appointment> findActiveDoctorAppointmentsByDate(
            @Param("doctorId") Long doctorId, 
            @Param("date") LocalDate date);
    
    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END FROM Appointment a " +
           "WHERE a.doctorId = :doctorId AND a.date = :date AND " +
           "((a.startTime <= :endTime AND a.endTime >= :startTime) OR " +
           "(a.startTime >= :startTime AND a.startTime < :endTime)) AND " +
           "a.status NOT IN ('CANCELLED', 'COMPLETED')")
    boolean isTimeSlotBooked(
            @Param("doctorId") Long doctorId,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime);
}