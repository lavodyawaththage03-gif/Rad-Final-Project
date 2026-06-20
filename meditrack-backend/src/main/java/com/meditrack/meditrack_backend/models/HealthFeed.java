package com.meditrack.meditrack_backend.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "healthFeeds")
public class HealthFeed {
    @Id
    private String id;
    private String title;
    private String content;
    private String category; // Local News, International News, University-Specific Alerts, Wellness Articles
    private Date createdAt;
}
