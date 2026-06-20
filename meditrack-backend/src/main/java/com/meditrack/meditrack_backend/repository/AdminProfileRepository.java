package com.meditrack.meditrack_backend.repository;

import com.meditrack.meditrack_backend.models.AdminProfile;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface AdminProfileRepository extends MongoRepository<AdminProfile, String> {
    Optional<AdminProfile> findByUserId(String userId);
}
