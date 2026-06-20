package com.meditrack.meditrack_backend.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "adminProfiles")
public class AdminProfile {
    @Id
    private String id;
    private String userId;
    private String adminId;
    private String address;
    private String adminLevel;
    private String department;
}
