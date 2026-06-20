package com.meditrack.meditrack_backend.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.util.Map;

@Data
@Document(collection = "doctorProfiles")
public class DoctorProfile {
    @Id
    private String id;
    private String userId;
    private String doctorId;
    
    // New fields from Registration
    private String medicalRegistrationNumber;
    private String department;
    private String qualification; // From Register.tsx
    private String availableDays; // From Register.tsx
    private String availableTime; // From Register.tsx
    
    // Shared fields
    private String specialization;
    private Integer yearsOfExperience;
    
    // Dashboard specific fields (keeping for compatibility)
    private String hospital;
    private String about;
    private Double consultationFee;
    private String liveStatus; // "Available" or "Unavailable"
    private List<String> qualifications; // From Dashboard.tsx
    private Map<String, String> availableHours; // From Dashboard.tsx
}
