package com.meditrack.meditrack_backend.repository;

import com.meditrack.meditrack_backend.models.SupportInquiry;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface SupportInquiryRepository extends MongoRepository<SupportInquiry, String> {
    List<SupportInquiry> findByStatus(String status);
}
