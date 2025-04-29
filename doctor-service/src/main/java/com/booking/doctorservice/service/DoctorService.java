package com.booking.doctorservice.service;

import com.booking.doctorservice.model.Doctor;
import com.booking.doctorservice.model.Schedule;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;

public interface DoctorService {
    
    // Doctor CRUD operations
    List<Doctor> getAllDoctors();
    
    Optional<Doctor> getDoctorById(Long id);
    
    Doctor saveDoctor(Doctor doctor);
    
    void deleteDoctor(Long id);
    
    // Specialized doctor search operations
    List<Doctor> getDoctorsBySpecialization(String specialization);
    
    List<Doctor> searchDoctorsByName(String name);
    
    List<String> getAllSpecializations();
    
    // Schedule management
    List<Schedule> getDoctorSchedules(Long doctorId);
    
    List<Schedule> getDoctorSchedulesByDay(Long doctorId, DayOfWeek dayOfWeek);
    
    Schedule addScheduleToDoctor(Long doctorId, Schedule schedule);
    
    void removeSchedule(Long scheduleId);
    
    List<DayOfWeek> getAvailableDaysForDoctor(Long doctorId);
}