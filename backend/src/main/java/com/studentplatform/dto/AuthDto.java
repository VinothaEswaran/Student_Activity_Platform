package com.studentplatform.dto;

import com.studentplatform.model.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

public class AuthDto {

    @Data
    public static class RegisterRequest {
        @NotBlank private String name;
        @NotBlank @Size(min = 3, max = 20) private String username;
        @NotBlank @Email private String email;
        @NotBlank @Size(min = 6) private String password;
        private String department;
        private String year;
        private User.Role role = User.Role.STUDENT;
    }

    @Data
    public static class LoginRequest {
        @NotBlank private String email;
        @NotBlank private String password;
    }

    @Data
    @lombok.AllArgsConstructor
    public static class JwtResponse {
        private String token;
        private String type = "Bearer";
        private Long id;
        private String name;
        private String username;
        private String email;
        private String role;

        public JwtResponse(String token, Long id, String name, String username, String email, String role) {
            this.token = token;
            this.id = id;
            this.name = name;
            this.username = username;
            this.email = email;
            this.role = role;
        }
    }

    @Data
    @lombok.AllArgsConstructor
    public static class MessageResponse {
        private String message;
    }
}
