package com.meditrack.meditrack_backend.repository;

import com.meditrack.meditrack_backend.models.CrowdDensity;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CrowdDensityRepository extends MongoRepository<CrowdDensity, String> {
}
