package com.meditrack.meditrack_backend.controllers;

import com.meditrack.meditrack_backend.models.HealthMetric;
import com.meditrack.meditrack_backend.repository.HealthMetricRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/health-metrics")
public class HealthMetricController {

    private final HealthMetricRepository repository;

    public HealthMetricController(HealthMetricRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getMetricsForStudent(@PathVariable String studentId) {
        List<HealthMetric> metrics = repository.findByStudentIdOrderByDateAsc(studentId);
        return ResponseEntity.ok(metrics);
    }

    @PostMapping
    public ResponseEntity<?> addMetric(@RequestBody HealthMetric metric) {
        if (metric.getDate() == null) {
            metric.setDate(new Date());
        }
        
        // Calculate BMI if height and weight are provided
        if (metric.getHeight() > 0 && metric.getWeight() > 0) {
            double heightInMeters = metric.getHeight() / 100.0;
            double bmi = metric.getWeight() / (heightInMeters * heightInMeters);
            metric.setBmi(Math.round(bmi * 10.0) / 10.0);
        }
        
        HealthMetric saved = repository.save(metric);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("success", true, "metric", saved));
    }
}
