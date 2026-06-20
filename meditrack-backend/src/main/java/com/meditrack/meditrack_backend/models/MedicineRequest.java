package com.meditrack.meditrack_backend.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "medicineRequests")
public class MedicineRequest {
    @Id
    private String id;
    private String doctorId;
    private String medicineName;
    private String medicineType;
    private String dosage;
    private Integer quantity;
    private String reason;
    private String priorityLevel;
    private String status; // "Pending", "Approved", "Rejected"
    private Date requestedAt;
}
