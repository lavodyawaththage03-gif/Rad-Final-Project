package com.meditrack.meditrack_backend.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "doctorSchedules")
public class DoctorSchedule {
    @Id
    private String id;
    private String doctorId;
    private Date date;
    private String startTime;
    private String endTime;
    private Boolean isAvailable;
}
