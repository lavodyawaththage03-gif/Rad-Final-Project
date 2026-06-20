package com.meditrack.meditrack_backend.repository;

import com.meditrack.meditrack_backend.models.PharmacistProfile;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface PharmacistProfileRepository extends MongoRepository<PharmacistProfile, String> {
    Optional<PharmacistProfile> findByUserId(String userId);
}
