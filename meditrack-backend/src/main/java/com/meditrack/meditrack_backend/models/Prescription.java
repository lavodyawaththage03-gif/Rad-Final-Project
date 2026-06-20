package com.meditrack.meditrack_backend.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Data
@Document(collection = "prescriptions")
public class Prescription {
    @Id
    private String id;
    private String doctorId;
    private String doctorName;
    private String studentId;
    private String studentName;
    private List<PrescribedMedicine> medicines;
    private String status; // PENDING_ADMIN_CHECK, ADMIN_CONFIRMED, PHARMACIST_CONFIRMED, DOCTOR_CONFIRMED, ISSUED
    private Date issuedAt;
}
