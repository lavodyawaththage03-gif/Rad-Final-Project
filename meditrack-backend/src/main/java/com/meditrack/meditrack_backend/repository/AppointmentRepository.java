package com.meditrack.meditrack_backend.repository;

import com.meditrack.meditrack_backend.models.Appointment;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface AppointmentRepository extends MongoRepository<Appointment, String> {
    List<Appointment> findByDoctorId(String doctorId);
    List<Appointment> findByStudentId(String studentId);
}
