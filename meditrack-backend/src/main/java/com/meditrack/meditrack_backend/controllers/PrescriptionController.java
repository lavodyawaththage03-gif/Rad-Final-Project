package com.meditrack.meditrack_backend.controllers;

import com.meditrack.meditrack_backend.models.Inventory;
import com.meditrack.meditrack_backend.models.Prescription;
import com.meditrack.meditrack_backend.repository.InventoryRepository;
import com.meditrack.meditrack_backend.repository.PrescriptionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    private final PrescriptionRepository prescriptionRepository;
    private final InventoryRepository inventoryRepository;

    public PrescriptionController(PrescriptionRepository prescriptionRepository, InventoryRepository inventoryRepository) {
        this.prescriptionRepository = prescriptionRepository;
        this.inventoryRepository = inventoryRepository;
    }

    @PostMapping
    public ResponseEntity<?> createPrescription(@RequestBody Prescription prescription) {
        if (prescription.getStatus() == null) {
            prescription.setStatus("PENDING_PHARMACIST_CHECK");
        }
        prescription.setIssuedAt(new Date());
        Prescription saved = prescriptionRepository.save(prescription);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("success", true, "prescription", saved));
    }

    @GetMapping
    public ResponseEntity<?> getAllPrescriptions() {
        return ResponseEntity.ok(prescriptionRepository.findAll());
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<?> getByDoctor(@PathVariable String doctorId) {
        return ResponseEntity.ok(prescriptionRepository.findByDoctorId(doctorId));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getByStudent(@PathVariable String studentId) {
        return ResponseEntity.ok(prescriptionRepository.findByStudentId(studentId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable String id, @RequestBody Map<String, String> payload) {
        Prescription prescription = prescriptionRepository.findById(id).orElse(null);
        if (prescription == null) {
            return ResponseEntity.notFound().build();
        }
        
        String newStatus = payload.get("status");
        prescription.setStatus(newStatus);
        prescriptionRepository.save(prescription);

        if ("ISSUED".equals(newStatus)) {
            List<Inventory> inventoryList = inventoryRepository.findAll();
            if (prescription.getMedicines() != null) {
                for (com.meditrack.meditrack_backend.models.PrescribedMedicine med : prescription.getMedicines()) {
                    for (Inventory item : inventoryList) {
                        if (item.getMedicineName() != null && item.getMedicineName().equalsIgnoreCase(med.getMedicineName())) {
                            int currentStock = item.getStockQuantity() != null ? item.getStockQuantity() : 0;
                            int quantity = med.getQuantity() != null ? med.getQuantity() : 1;
                            item.setStockQuantity(Math.max(0, currentStock - quantity));
                            inventoryRepository.save(item);
                            break;
                        }
                    }
                }
            }
        }
        
        return ResponseEntity.ok(prescription);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePrescription(@PathVariable String id) {
        if (prescriptionRepository.existsById(id)) {
            prescriptionRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
