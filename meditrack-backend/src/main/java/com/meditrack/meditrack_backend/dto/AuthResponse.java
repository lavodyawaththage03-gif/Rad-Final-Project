package com.meditrack.meditrack_backend.dto;

import com.meditrack.meditrack_backend.models.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private boolean success;
    private String token;
    private UserDto user;

    @Data
    @AllArgsConstructor
    public static class UserDto {
        private String id;
        private String email;
        private Role role;
        private String firstName;
        private String lastName;
        private String phoneNumber;
    }
}
