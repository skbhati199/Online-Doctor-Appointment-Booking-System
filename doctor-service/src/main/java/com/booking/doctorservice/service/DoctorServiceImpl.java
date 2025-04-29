package com.booking.doctorservice.service;

import com.booking.doctorservice.model.Doctor;
import com.booking.doctorservice.model.Schedule;
import com.booking.doctorservice.repository.DoctorRepository;
import com.booking.doctorservice.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;

@Service
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;
    private final ScheduleRepository scheduleRepository;

    @Autowired
    public DoctorServiceImpl(DoctorRepository doctorRepository, ScheduleRepository scheduleRepository) {
        this.doctorRepository = doctorRepository;
        this.scheduleRepository = scheduleRepository;
    }

    @Override
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    @Override
    public Optional<Doctor> getDoctorById(Long id) {
        return doctorRepository.findById(id);
    }

    @Override
    @Transactional
    public Doctor saveDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    @Override
    @Transactional
    public void deleteDoctor(Long id) {
        doctorRepository.deleteById(id);
    }

    @Override
    public List<Doctor> getDoctorsBySpecialization(String specialization) {
        return doctorRepository.findBySpecialization(specialization);
    }

    @Override
    public List<Doctor> searchDoctorsByName(String name) {
        return doctorRepository.findByNameContainingIgnoreCase(name);
    }

    @Override
    public List<String> getAllSpecializations() {
        return doctorRepository.findAllSpecializations();
    }

    @Override
    public List<Schedule> getDoctorSchedules(Long doctorId) {
        return scheduleRepository.findByDoctorId(doctorId);
    }

    @Override
    public List<Schedule> getDoctorSchedulesByDay(Long doctorId, DayOfWeek dayOfWeek) {
        return scheduleRepository.findByDoctorIdAndDayOfWeekOrderByStartTime(doctorId, dayOfWeek);
    }

    @Override
    @Transactional
    public Schedule addScheduleToDoctor(Long doctorId, Schedule schedule) {
        return doctorRepository.findById(doctorId).map(doctor -> {
            schedule.setDoctor(doctor);
            return scheduleRepository.save(schedule);
        }).orElseThrow(() -> new RuntimeException("Doctor not found with id: " + doctorId));
    }

    @Override
    @Transactional
    public void removeSchedule(Long scheduleId) {
        scheduleRepository.deleteById(scheduleId);
    }

    @Override
    public List<DayOfWeek> getAvailableDaysForDoctor(Long doctorId) {
        return scheduleRepository.findAvailableDaysByDoctorId(doctorId);
    }
}