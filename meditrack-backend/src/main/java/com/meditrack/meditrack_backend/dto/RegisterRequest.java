package com.meditrack.meditrack_backend.dto;

import com.meditrack.meditrack_backend.models.Role;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.util.Date;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String confirmPassword;
    private Role role;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    
    // Student specific
    private String studentId;
    private String address;
    private String faculty;
    private String degreeProgram;
    private String academicYear;
    private String gender;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date dateOfBirth;
    private String emergencyContact;
    private String emergencyContactPhone;
    private String bloodGroup;
    private String allergies;
    private String medicalHistory;
    
    // Doctor specific
    private String doctorId;
    private String medicalRegistrationNumber;
    private String specialization;
    private String qualification;
    private String availableDays;
    private String availableTime;
    private Integer yearsOfExperience;
    private String department;
    private String hospital;
    
    // Pharmacist specific
    private String pharmacistId;
    private String licenseNumber;
    private String workingShift;
    
    // Admin specific
    private String adminId;
}
