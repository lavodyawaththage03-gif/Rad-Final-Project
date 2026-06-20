package com.meditrack.meditrack_backend.controllers;

import com.meditrack.meditrack_backend.dto.AuthRequest;
import com.meditrack.meditrack_backend.dto.AuthResponse;
import com.meditrack.meditrack_backend.dto.RegisterRequest;
import com.meditrack.meditrack_backend.models.*;
import com.meditrack.meditrack_backend.repository.*;
import com.meditrack.meditrack_backend.security.JwtService;
import com.meditrack.meditrack_backend.security.UserDetailsImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final DoctorProfileRepository doctorProfileRepository;
    private final PharmacistProfileRepository pharmacistProfileRepository;
    private final AdminProfileRepository adminProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthController(UserRepository userRepository, StudentProfileRepository studentProfileRepository,
                          DoctorProfileRepository doctorProfileRepository, PharmacistProfileRepository pharmacistProfileRepository,
                          AdminProfileRepository adminProfileRepository, PasswordEncoder passwordEncoder,
                          JwtService jwtService, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.doctorProfileRepository = doctorProfileRepository;
        this.pharmacistProfileRepository = pharmacistProfileRepository;
        this.adminProfileRepository = adminProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            if (!request.getPassword().equals(request.getConfirmPassword())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Passwords do not match"));
            }
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
            }

            User user = new User();
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setRole(request.getRole());
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setPhoneNumber(request.getPhoneNumber());

            user = userRepository.save(user);

            String profileId = null;
            if (request.getRole() == Role.STUDENT) {
                StudentProfile profile = new StudentProfile();
                profile.setUserId(user.getId());
                profile.setStudentId(request.getStudentId());
                profile.setDegreeProgram(request.getDegreeProgram());
                profile.setFaculty(request.getFaculty());
                profile.setMedicalHistory(request.getMedicalHistory());
                profile.setBloodGroup(request.getBloodGroup());
                profile.setAllergies(request.getAllergies());
                profile.setEmergencyContact(request.getEmergencyContact());
                profile.setEmergencyContactPhone(request.getEmergencyContactPhone());
                profile.setAcademicYear(request.getAcademicYear());
                profile.setGender(request.getGender());
                profile.setDateOfBirth(request.getDateOfBirth());
                profile.setAddress(request.getAddress());
                profile = studentProfileRepository.save(profile);
                profileId = profile.getId();
            } else if (request.getRole() == Role.DOCTOR) {
                DoctorProfile profile = new DoctorProfile();
                profile.setUserId(user.getId());
                profile.setDoctorId(request.getDoctorId());
                profile.setMedicalRegistrationNumber(request.getMedicalRegistrationNumber());
                profile.setSpecialization(request.getSpecialization());
                profile.setQualification(request.getQualification());
                profile.setAvailableDays(request.getAvailableDays());
                profile.setAvailableTime(request.getAvailableTime());
                profile.setYearsOfExperience(request.getYearsOfExperience());
                profile.setDepartment(request.getDepartment());
                profile.setHospital(request.getHospital());
                profile.setLiveStatus("Available");
                
                // Initialize lists/maps to avoid null pointers in frontend
                profile.setQualifications(new java.util.ArrayList<>());
                if (request.getQualification() != null) {
                    profile.getQualifications().add(request.getQualification());
                }
                profile.setAvailableHours(new java.util.HashMap<>());
                
                profile = doctorProfileRepository.save(profile);
                profileId = profile.getId();
            } else if (request.getRole() == Role.PHARMACIST) {
                PharmacistProfile profile = new PharmacistProfile();
                profile.setUserId(user.getId());
                profile.setPharmacistId(request.getPharmacistId());
                profile.setLicenseNumber(request.getLicenseNumber());
                profile.setQualification(request.getQualification());
                profile.setWorkingShift(request.getWorkingShift());
                profile.setAddress(request.getAddress());
                profile.setDepartment(request.getDepartment());
                profile = pharmacistProfileRepository.save(profile);
                profileId = profile.getId();
            } else if (request.getRole() == Role.ADMIN) {
                AdminProfile profile = new AdminProfile();
                profile.setUserId(user.getId());
                profile.setAdminId(request.getAdminId());
                profile.setAdminLevel("admin");
                profile = adminProfileRepository.save(profile);
                profileId = profile.getId();
            }

            user.setProfileId(profileId);
            userRepository.save(user);

            String token = jwtService.generateToken(new UserDetailsImpl(user));

            AuthResponse.UserDto userDto = new AuthResponse.UserDto(
                    user.getId(), user.getEmail(), user.getRole(), user.getFirstName(), user.getLastName(), user.getPhoneNumber()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponse(true, token, userDto));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage() != null ? e.getMessage() : e.toString()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userDetails.getUser();
        String token = jwtService.generateToken(userDetails);

        AuthResponse.UserDto userDto = new AuthResponse.UserDto(
                user.getId(), user.getEmail(), user.getRole(), user.getFirstName(), user.getLastName(), user.getPhoneNumber()
        );
        return ResponseEntity.ok(new AuthResponse(true, token, userDto));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not authenticated"));
        }

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userDetails.getUser();

        AuthResponse.UserDto userDto = new AuthResponse.UserDto(
                user.getId(), user.getEmail(), user.getRole(), user.getFirstName(), user.getLastName(), user.getPhoneNumber()
        );

        Object profile = null;
        if (user.getRole() == Role.STUDENT) {
            profile = studentProfileRepository.findByUserId(user.getId()).orElse(null);
        } else if (user.getRole() == Role.DOCTOR) {
            profile = doctorProfileRepository.findByUserId(user.getId()).orElse(null);
        } else if (user.getRole() == Role.PHARMACIST) {
            profile = pharmacistProfileRepository.findByUserId(user.getId()).orElse(null);
        } else if (user.getRole() == Role.ADMIN) {
            profile = adminProfileRepository.findByUserId(user.getId()).orElse(null);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("user", userDto);
        if (profile != null) {
            response.put("profile", profile);
        }

        return ResponseEntity.ok(response);
    }
}
