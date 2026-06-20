package com.meditrack.meditrack_backend.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "supportInquiries")
public class SupportInquiry {
    @Id
    private String id;
    private String senderName;
    private String email;
    private String message;
    private Date createdAt;
    private String status; // "Open" or "Closed"
}
