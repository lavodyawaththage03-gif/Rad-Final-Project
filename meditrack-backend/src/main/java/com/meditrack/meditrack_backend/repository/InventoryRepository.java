package com.meditrack.meditrack_backend.repository;

import com.meditrack.meditrack_backend.models.Inventory;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface InventoryRepository extends MongoRepository<Inventory, String> {
    Optional<Inventory> findByMedicineName(String medicineName);
}
