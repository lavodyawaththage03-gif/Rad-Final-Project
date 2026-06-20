package com.meditrack.meditrack_backend.repository;

import com.meditrack.meditrack_backend.models.Prescription;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionRepository extends MongoRepository<Prescription, String> {
    List<Prescription> findByDoctorId(String doctorId);
    List<Prescription> findByStudentId(String studentId);
    List<Prescription> findByStatus(String status);
}
