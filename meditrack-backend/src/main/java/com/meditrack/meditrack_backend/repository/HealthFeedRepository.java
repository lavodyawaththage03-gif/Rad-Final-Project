package com.meditrack.meditrack_backend.repository;

import com.meditrack.meditrack_backend.models.HealthFeed;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface HealthFeedRepository extends MongoRepository<HealthFeed, String> {
    List<HealthFeed> findByCategory(String category);
}
