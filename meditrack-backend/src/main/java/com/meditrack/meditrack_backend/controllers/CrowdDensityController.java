package com.meditrack.meditrack_backend.controllers;

import com.meditrack.meditrack_backend.models.CrowdDensity;
import com.meditrack.meditrack_backend.repository.CrowdDensityRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/crowd")
public class CrowdDensityController {

    private final CrowdDensityRepository crowdDensityRepository;

    public CrowdDensityController(CrowdDensityRepository crowdDensityRepository) {
        this.crowdDensityRepository = crowdDensityRepository;
    }

    @GetMapping
    public ResponseEntity<?> getCrowdDensity() {
        List<CrowdDensity> records = crowdDensityRepository.findAll();
        if (records.isEmpty()) {
            return ResponseEntity.ok(Map.of("level", "Low", "updatedAt", new Date()));
        }
        return ResponseEntity.ok(records.get(0));
    }

    @PutMapping
    public ResponseEntity<?> updateCrowdDensity(@RequestBody Map<String, String> payload) {
        List<CrowdDensity> records = crowdDensityRepository.findAll();
        CrowdDensity density;
        if (records.isEmpty()) {
            density = new CrowdDensity();
        } else {
            density = records.get(0);
        }
        density.setLevel(payload.get("level"));
        density.setUpdatedAt(new Date());
        crowdDensityRepository.save(density);
        
        return ResponseEntity.ok(Map.of("message", "Crowd density updated successfully", "density", density));
    }
}
