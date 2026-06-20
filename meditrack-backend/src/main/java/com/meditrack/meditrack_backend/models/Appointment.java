package com.meditrack.meditrack_backend.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "appointments")
public class Appointment {
    @Id
    private String id;
    private String doctorId;
    private String studentId;
    private Date appointmentDate;
    private String startTime;
    private String endTime;
    private String reason;
    private String status; // "Scheduled", "Completed", "Cancelled"
    private String zoomLink;
    private String notes;
}
