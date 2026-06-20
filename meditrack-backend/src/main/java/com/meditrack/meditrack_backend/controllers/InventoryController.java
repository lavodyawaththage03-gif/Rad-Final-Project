package com.meditrack.meditrack_backend.controllers;

import com.meditrack.meditrack_backend.models.Inventory;
import com.meditrack.meditrack_backend.repository.InventoryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryRepository inventoryRepository;

    public InventoryController(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    @GetMapping
    public ResponseEntity<?> getAllInventory() {
        List<Inventory> inventoryList = inventoryRepository.findAll();
        return ResponseEntity.ok(inventoryList);
    }

    @PostMapping
    public ResponseEntity<?> addInventoryItem(@RequestBody Inventory inventoryItem) {
        if (inventoryItem.getStockQuantity() == null) {
            inventoryItem.setStockQuantity(0);
        }
        Inventory savedItem = inventoryRepository.save(inventoryItem);
        return ResponseEntity.ok(savedItem);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateInventoryItem(@PathVariable String id, @RequestBody Inventory updatedItem) {
        return inventoryRepository.findById(id).map(existingItem -> {
            if (updatedItem.getMedicineName() != null) {
                existingItem.setMedicineName(updatedItem.getMedicineName());
            }
            if (updatedItem.getStockQuantity() != null) {
                existingItem.setStockQuantity(updatedItem.getStockQuantity());
            }
            if (updatedItem.getExpiryDate() != null) {
                existingItem.setExpiryDate(updatedItem.getExpiryDate());
            }
            Inventory savedItem = inventoryRepository.save(existingItem);
            return ResponseEntity.ok(savedItem);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteInventoryItem(@PathVariable String id) {
        return inventoryRepository.findById(id).map(item -> {
            inventoryRepository.delete(item);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
