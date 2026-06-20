package com.meditrack.meditrack_backend.controllers;

import com.meditrack.meditrack_backend.models.HealthFeed;
import com.meditrack.meditrack_backend.repository.HealthFeedRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/health-feed")
public class HealthFeedController {

    private final HealthFeedRepository healthFeedRepository;

    public HealthFeedController(HealthFeedRepository healthFeedRepository) {
        this.healthFeedRepository = healthFeedRepository;
    }

    @GetMapping
    public ResponseEntity<?> getAllFeeds() {
        List<HealthFeed> feeds = healthFeedRepository.findAll();
        return ResponseEntity.ok(feeds);
    }

    @PostMapping
    public ResponseEntity<?> createFeed(@RequestBody HealthFeed feed) {
        feed.setCreatedAt(new Date());
        HealthFeed saved = healthFeedRepository.save(feed);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("success", true, "feed", saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFeed(@PathVariable String id) {
        if (!healthFeedRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        healthFeedRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Feed deleted successfully"));
    }
}
