package com.booking.doctorservice.repository;

import com.booking.doctorservice.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    
    List<Doctor> findBySpecialization(String specialization);
    
    @Query("SELECT DISTINCT d.specialization FROM Doctor d")
    List<String> findAllSpecializations();
    
    // Find doctors by name containing the search term (case insensitive)
    List<Doctor> findByNameContainingIgnoreCase(String name);
}