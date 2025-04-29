package com.booking.doctorservice.repository;

import com.booking.doctorservice.model.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    
    List<Schedule> findByDoctorId(Long doctorId);
    
    List<Schedule> findByDoctorIdAndDayOfWeek(Long doctorId, DayOfWeek dayOfWeek);
    
    @Query("SELECT s FROM Schedule s WHERE s.doctor.id = :doctorId AND s.dayOfWeek = :dayOfWeek ORDER BY s.startTime")
    List<Schedule> findByDoctorIdAndDayOfWeekOrderByStartTime(
            @Param("doctorId") Long doctorId, 
            @Param("dayOfWeek") DayOfWeek dayOfWeek);
    
    @Query("SELECT DISTINCT s.dayOfWeek FROM Schedule s WHERE s.doctor.id = :doctorId")
    List<DayOfWeek> findAvailableDaysByDoctorId(@Param("doctorId") Long doctorId);
}