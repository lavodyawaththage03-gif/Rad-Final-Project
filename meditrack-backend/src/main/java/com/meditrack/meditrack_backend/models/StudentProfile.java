package com.meditrack.meditrack_backend.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;

@Data
@Document(collection = "studentProfiles")
public class StudentProfile {
    @Id
    private String id;
    private String userId;
    private String studentId;
    private String degreeProgram;
    private String faculty;
    private String academicYear;
    private String gender;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date dateOfBirth;
    private String phoneNumber;
    private String address;
    private String emergencyContact;
    private String emergencyContactPhone;
    private String bloodGroup;
    private String allergies;
    private String medicalHistory;
    private String profilePicture;
    private String height;
    private String weight;
}
