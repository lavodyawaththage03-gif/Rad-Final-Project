package com.meditrack.meditrack_backend.repository;

import com.meditrack.meditrack_backend.models.DoctorProfile;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface DoctorProfileRepository extends MongoRepository<DoctorProfile, String> {
    Optional<DoctorProfile> findByUserId(String userId);
}
