package com.meditrack.meditrack_backend.repository;

import com.meditrack.meditrack_backend.models.HealthMetric;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HealthMetricRepository extends MongoRepository<HealthMetric, String> {
    List<HealthMetric> findByStudentIdOrderByDateAsc(String studentId);
}
