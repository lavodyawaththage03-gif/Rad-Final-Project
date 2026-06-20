package com.meditrack.meditrack_backend.repository;

import com.meditrack.meditrack_backend.models.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByStudentIdOrderByCreatedAtDesc(String studentId);
}
