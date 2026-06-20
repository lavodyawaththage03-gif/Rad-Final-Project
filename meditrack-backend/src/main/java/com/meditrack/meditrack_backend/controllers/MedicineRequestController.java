package com.meditrack.meditrack_backend.controllers;

import com.meditrack.meditrack_backend.models.Inventory;
import com.meditrack.meditrack_backend.models.MedicineRequest;
import com.meditrack.meditrack_backend.repository.InventoryRepository;
import com.meditrack.meditrack_backend.repository.MedicineRequestRepository;
import org.springframework.data.mongodb.MongoTransactionException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/medicine-requests")
public class MedicineRequestController {

    private final MedicineRequestRepository medicineRequestRepository;
    private final InventoryRepository inventoryRepository;

    public MedicineRequestController(MedicineRequestRepository medicineRequestRepository, InventoryRepository inventoryRepository) {
        this.medicineRequestRepository = medicineRequestRepository;
        this.inventoryRepository = inventoryRepository;
    }

    @PostMapping
    public ResponseEntity<?> createMedicineRequest(@RequestBody MedicineRequest request) {
        request.setStatus("Pending");
        request.setRequestedAt(new Date());
        MedicineRequest saved = medicineRequestRepository.save(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("success", true, "request", saved));
    }

    @GetMapping
    public ResponseEntity<?> getAllMedicineRequests() {
        List<MedicineRequest> requests = medicineRequestRepository.findAll();
        return ResponseEntity.ok(requests);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMedicineRequestStatus(@PathVariable String id, @RequestBody Map<String, String> payload) {
        try {
            MedicineRequest request = medicineRequestRepository.findById(id).orElse(null);
            if (request == null) {
                return ResponseEntity.notFound().build();
            }

            String status = payload.get("status");
            request.setStatus(status);
            medicineRequestRepository.save(request);

            // If approved, dynamically update inventory schema
            if ("Approved".equals(status)) {
                Inventory inventory = inventoryRepository.findByMedicineName(request.getMedicineName()).orElse(null);
                if (inventory == null) {
                    inventory = new Inventory();
                    inventory.setMedicineName(request.getMedicineName());
                    inventory.setStockQuantity(request.getQuantity());
                    // Set an expiry date 10 days from now to test alerts
                    inventory.setExpiryDate(new java.util.Date(System.currentTimeMillis() + 10L * 24 * 60 * 60 * 1000));
                } else {
                    inventory.setStockQuantity(inventory.getStockQuantity() + request.getQuantity());
                }
                inventoryRepository.save(inventory);
            }

            return ResponseEntity.ok(Map.of("message", "Medicine request status updated", "request", request));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Internal server error"));
        }
    }
}
