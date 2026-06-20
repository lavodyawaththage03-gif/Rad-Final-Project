package com.meditrack.meditrack_backend.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "pharmacistProfiles")
public class PharmacistProfile {
    @Id
    private String id;
    private String userId;
    private String pharmacistId;
    private String address;
    private String licenseNumber;
    private String qualification;
    private String workingShift;
    private String department;
}
