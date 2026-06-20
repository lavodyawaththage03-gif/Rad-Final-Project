package com.meditrack.meditrack_backend.repository;

import com.meditrack.meditrack_backend.models.MedicineRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface MedicineRequestRepository extends MongoRepository<MedicineRequest, String> {
    List<MedicineRequest> findByStatus(String status);
    List<MedicineRequest> findByDoctorId(String doctorId);
}
