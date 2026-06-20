package com.meditrack.meditrack_backend.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "healthMetrics")
public class HealthMetric {
    @Id
    private String id;
    private String studentId;
    
    // Blood Pressure
    private int bloodPressureSystolic;
    private int bloodPressureDiastolic;
    
    // Vitals
    private int heartRate;
    private int steps;
    
    // Body Measurements
    private double weight; // in kg
    private double height; // in cm
    private double bmi;
    
    private Date date;
}
