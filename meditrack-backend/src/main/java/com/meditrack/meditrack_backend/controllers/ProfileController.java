package com.meditrack.meditrack_backend.controllers;

import com.meditrack.meditrack_backend.models.AdminProfile;
import com.meditrack.meditrack_backend.models.DoctorProfile;
import com.meditrack.meditrack_backend.models.PharmacistProfile;
import com.meditrack.meditrack_backend.models.StudentProfile;
import com.meditrack.meditrack_backend.models.User;
import com.meditrack.meditrack_backend.repository.AdminProfileRepository;
import com.meditrack.meditrack_backend.repository.DoctorProfileRepository;
import com.meditrack.meditrack_backend.repository.PharmacistProfileRepository;
import com.meditrack.meditrack_backend.repository.StudentProfileRepository;
import com.meditrack.meditrack_backend.repository.UserRepository;
import com.meditrack.meditrack_backend.security.UserDetailsImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final DoctorProfileRepository doctorProfileRepository;
    private final AdminProfileRepository adminProfileRepository;
    private final PharmacistProfileRepository pharmacistProfileRepository;

    public ProfileController(UserRepository userRepository,
                             StudentProfileRepository studentProfileRepository,
                             DoctorProfileRepository doctorProfileRepository,
                             AdminProfileRepository adminProfileRepository,
                             PharmacistProfileRepository pharmacistProfileRepository) {
        this.userRepository = userRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.doctorProfileRepository = doctorProfileRepository;
        this.adminProfileRepository = adminProfileRepository;
        this.pharmacistProfileRepository = pharmacistProfileRepository;
    }

    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetailsImpl) {
            return ((UserDetailsImpl) authentication.getPrincipal()).getUser();
        }
        throw new RuntimeException("User not authenticated");
    }

    @PutMapping("/doctor")
    public ResponseEntity<?> updateDoctorProfile(@RequestBody DoctorProfile updatedProfile) {
        User user = getAuthenticatedUser();
        DoctorProfile profile = doctorProfileRepository.findByUserId(user.getId()).orElseThrow(() -> new RuntimeException("Profile not found"));
        
        // Update fields
        if (updatedProfile.getMedicalRegistrationNumber() != null) profile.setMedicalRegistrationNumber(updatedProfile.getMedicalRegistrationNumber());
        if (updatedProfile.getSpecialization() != null) profile.setSpecialization(updatedProfile.getSpecialization());
        if (updatedProfile.getDepartment() != null) profile.setDepartment(updatedProfile.getDepartment());
        if (updatedProfile.getQualification() != null) profile.setQualification(updatedProfile.getQualification());
        if (updatedProfile.getYearsOfExperience() != null) profile.setYearsOfExperience(updatedProfile.getYearsOfExperience());
        if (updatedProfile.getConsultationFee() != null) profile.setConsultationFee(updatedProfile.getConsultationFee());
        if (updatedProfile.getAvailableDays() != null) profile.setAvailableDays(updatedProfile.getAvailableDays());
        if (updatedProfile.getAvailableTime() != null) profile.setAvailableTime(updatedProfile.getAvailableTime());
        if (updatedProfile.getHospital() != null) profile.setHospital(updatedProfile.getHospital());
        
        doctorProfileRepository.save(profile);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/student")
    public ResponseEntity<?> updateStudentProfile(@RequestBody StudentProfile updatedProfile) {
        User user = getAuthenticatedUser();
        StudentProfile profile = studentProfileRepository.findByUserId(user.getId()).orElseThrow(() -> new RuntimeException("Profile not found"));
        
        // Update fields
        if (updatedProfile.getStudentId() != null) profile.setStudentId(updatedProfile.getStudentId());
        if (updatedProfile.getDegreeProgram() != null) profile.setDegreeProgram(updatedProfile.getDegreeProgram());
        if (updatedProfile.getFaculty() != null) profile.setFaculty(updatedProfile.getFaculty());
        if (updatedProfile.getHeight() != null) profile.setHeight(updatedProfile.getHeight());
        if (updatedProfile.getWeight() != null) profile.setWeight(updatedProfile.getWeight());
        if (updatedProfile.getBloodGroup() != null) profile.setBloodGroup(updatedProfile.getBloodGroup());
        if (updatedProfile.getAllergies() != null) profile.setAllergies(updatedProfile.getAllergies());
        if (updatedProfile.getMedicalHistory() != null) profile.setMedicalHistory(updatedProfile.getMedicalHistory());
        if (updatedProfile.getEmergencyContact() != null) profile.setEmergencyContact(updatedProfile.getEmergencyContact());
        if (updatedProfile.getEmergencyContactPhone() != null) profile.setEmergencyContactPhone(updatedProfile.getEmergencyContactPhone());
        
        studentProfileRepository.save(profile);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/admin")
    public ResponseEntity<?> updateAdminProfile(@RequestBody AdminProfile updatedProfile) {
        User user = getAuthenticatedUser();
        AdminProfile profile = adminProfileRepository.findByUserId(user.getId()).orElseThrow(() -> new RuntimeException("Profile not found"));
        
        if (updatedProfile.getAdminLevel() != null) profile.setAdminLevel(updatedProfile.getAdminLevel());
        if (updatedProfile.getDepartment() != null) profile.setDepartment(updatedProfile.getDepartment());
        
        adminProfileRepository.save(profile);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/pharmacist")
    public ResponseEntity<?> updatePharmacistProfile(@RequestBody PharmacistProfile updatedProfile) {
        User user = getAuthenticatedUser();
        PharmacistProfile profile = pharmacistProfileRepository.findByUserId(user.getId()).orElseThrow(() -> new RuntimeException("Profile not found"));
        
        if (updatedProfile.getLicenseNumber() != null) profile.setLicenseNumber(updatedProfile.getLicenseNumber());
        if (updatedProfile.getQualification() != null) profile.setQualification(updatedProfile.getQualification());
        if (updatedProfile.getWorkingShift() != null) profile.setWorkingShift(updatedProfile.getWorkingShift());
        if (updatedProfile.getAddress() != null) profile.setAddress(updatedProfile.getAddress());
        if (updatedProfile.getDepartment() != null) profile.setDepartment(updatedProfile.getDepartment());
        
        pharmacistProfileRepository.save(profile);
        return ResponseEntity.ok(profile);
    }
}
