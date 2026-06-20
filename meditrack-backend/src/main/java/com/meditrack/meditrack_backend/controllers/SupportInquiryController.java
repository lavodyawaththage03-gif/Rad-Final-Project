package com.meditrack.meditrack_backend.controllers;

import com.meditrack.meditrack_backend.models.SupportInquiry;
import com.meditrack.meditrack_backend.repository.SupportInquiryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inquiries")
public class SupportInquiryController {

    private final SupportInquiryRepository supportInquiryRepository;

    public SupportInquiryController(SupportInquiryRepository supportInquiryRepository) {
        this.supportInquiryRepository = supportInquiryRepository;
    }

    @PostMapping
    public ResponseEntity<?> submitInquiry(@RequestBody SupportInquiry inquiry) {
        inquiry.setCreatedAt(new Date());
        inquiry.setStatus("Open");
        SupportInquiry saved = supportInquiryRepository.save(inquiry);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("success", true, "inquiry", saved));
    }

    @GetMapping
    public ResponseEntity<?> getAllInquiries() {
        List<SupportInquiry> inquiries = supportInquiryRepository.findAll();
        return ResponseEntity.ok(inquiries);
    }
}
