package com.meditrack.meditrack_backend.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "crowdDensity")
public class CrowdDensity {
    @Id
    private String id;
    private String level; // "Low", "Medium", "High"
    private Date updatedAt;
}
