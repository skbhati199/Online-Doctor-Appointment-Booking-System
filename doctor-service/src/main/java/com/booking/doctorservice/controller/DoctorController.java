package com.booking.doctorservice.controller;

import com.booking.doctorservice.model.Doctor;
import com.booking.doctorservice.model.Schedule;
import com.booking.doctorservice.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorService doctorService;

    @Autowired
    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @GetMapping
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getDoctorById(@PathVariable Long id) {
        return doctorService.getDoctorById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Doctor> createDoctor(@RequestBody Doctor doctor) {
        return ResponseEntity.status(HttpStatus.CREATED).body(doctorService.saveDoctor(doctor));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Doctor> updateDoctor(@PathVariable Long id, @RequestBody Doctor doctor) {
        return doctorService.getDoctorById(id)
                .map(existingDoctor -> {
                    doctor.setId(id);
                    return ResponseEntity.ok(doctorService.saveDoctor(doctor));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable Long id) {
        return doctorService.getDoctorById(id)
                .map(doctor -> {
                    doctorService.deleteDoctor(id);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/specialization/{specialization}")
    public ResponseEntity<List<Doctor>> getDoctorsBySpecialization(@PathVariable String specialization) {
        return ResponseEntity.ok(doctorService.getDoctorsBySpecialization(specialization));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Doctor>> searchDoctorsByName(@RequestParam String name) {
        return ResponseEntity.ok(doctorService.searchDoctorsByName(name));
    }

    @GetMapping("/specializations")
    public ResponseEntity<List<String>> getAllSpecializations() {
        return ResponseEntity.ok(doctorService.getAllSpecializations());
    }

    // Schedule management endpoints
    @GetMapping("/{doctorId}/schedules")
    public ResponseEntity<List<Schedule>> getDoctorSchedules(@PathVariable Long doctorId) {
        return ResponseEntity.ok(doctorService.getDoctorSchedules(doctorId));
    }

    @GetMapping("/{doctorId}/schedules/day/{dayOfWeek}")
    public ResponseEntity<List<Schedule>> getDoctorSchedulesByDay(
            @PathVariable Long doctorId,
            @PathVariable DayOfWeek dayOfWeek) {
        return ResponseEntity.ok(doctorService.getDoctorSchedulesByDay(doctorId, dayOfWeek));
    }

    @PostMapping("/{doctorId}/schedules")
    public ResponseEntity<Schedule> addScheduleToDoctor(
            @PathVariable Long doctorId,
            @RequestBody Schedule schedule) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(doctorService.addScheduleToDoctor(doctorId, schedule));
    }

    @DeleteMapping("/schedules/{scheduleId}")
    public ResponseEntity<Void> removeSchedule(@PathVariable Long scheduleId) {
        doctorService.removeSchedule(scheduleId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{doctorId}/available-days")
    public ResponseEntity<List<DayOfWeek>> getAvailableDaysForDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(doctorService.getAvailableDaysForDoctor(doctorId));
    }
}