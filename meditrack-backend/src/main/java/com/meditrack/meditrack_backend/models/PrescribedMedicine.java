package com.meditrack.meditrack_backend.models;

import lombok.Data;

@Data
public class PrescribedMedicine {
    private String medicineName;
    private String dosage;
    private Integer quantity;
    private String instructions;
}
