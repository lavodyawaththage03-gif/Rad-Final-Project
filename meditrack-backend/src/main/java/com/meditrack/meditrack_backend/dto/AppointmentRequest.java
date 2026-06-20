package com.meditrack.meditrack_backend.dto;

import lombok.Data;

@Data
public class AppointmentRequest {
    private String doctorId;
    private String studentId;
    private String scheduleId;
    private String reason;
}
