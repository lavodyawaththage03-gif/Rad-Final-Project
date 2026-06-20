package com.meditrack.meditrack_backend.repository;

import com.meditrack.meditrack_backend.models.DoctorSchedule;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface DoctorScheduleRepository extends MongoRepository<DoctorSchedule, String> {
    List<DoctorSchedule> findByDoctorId(String doctorId);
    List<DoctorSchedule> findByDoctorIdAndIsAvailableTrue(String doctorId);
}
