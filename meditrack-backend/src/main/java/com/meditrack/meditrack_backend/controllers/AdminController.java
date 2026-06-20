package com.meditrack.meditrack_backend.controllers;

import com.meditrack.meditrack_backend.models.User;
import com.meditrack.meditrack_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        List<User> users = userRepository.findAll();
        long totalUsers = users.size();
        long totalDoctors = users.stream().filter(u -> u.getRole() != null && "DOCTOR".equals(u.getRole().name())).count();
        long totalStudents = users.stream().filter(u -> u.getRole() != null && "STUDENT".equals(u.getRole().name())).count();
        long totalPharmacists = users.stream().filter(u -> u.getRole() != null && "PHARMACIST".equals(u.getRole().name())).count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("totalDoctors", totalDoctors);
        stats.put("totalStudents", totalStudents);
        stats.put("totalPharmacists", totalPharmacists);

        return ResponseEntity.ok(stats);
    }
}
