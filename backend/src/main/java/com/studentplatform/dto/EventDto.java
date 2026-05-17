package com.studentplatform.dto;

import com.studentplatform.model.Event;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

public class EventDto {

    @Data
    public static class CreateRequest {
        @NotBlank private String title;
        private String description;
        private String venue;
        @NotNull private LocalDateTime eventDate;
        private LocalDateTime registrationDeadline;
        private Event.Category category;
        private int maxParticipants;
        private String imageUrl;
        private String organizer;
    }

    @Data
    public static class EventResponse {
        private Long id;
        private String title;
        private String description;
        private String venue;
        private LocalDateTime eventDate;
        private LocalDateTime registrationDeadline;
        private Event.Category category;
        private Event.Status status;
        private int maxParticipants;
        private int registeredCount;
        private String imageUrl;
        private String organizer;
        private String createdByName;
        private LocalDateTime createdAt;
        private boolean isRegistered;

        public static EventResponse from(Event event, boolean isRegistered) {
            EventResponse dto = new EventResponse();
            dto.setId(event.getId());
            dto.setTitle(event.getTitle());
            dto.setDescription(event.getDescription());
            dto.setVenue(event.getVenue());
            dto.setEventDate(event.getEventDate());
            dto.setRegistrationDeadline(event.getRegistrationDeadline());
            dto.setCategory(event.getCategory());
            dto.setStatus(event.getStatus());
            dto.setMaxParticipants(event.getMaxParticipants());
            dto.setRegisteredCount(event.getRegisteredCount());
            dto.setImageUrl(event.getImageUrl());
            dto.setOrganizer(event.getOrganizer());
            dto.setCreatedAt(event.getCreatedAt());
            dto.setRegistered(isRegistered);
            if (event.getCreatedBy() != null) {
                dto.setCreatedByName(event.getCreatedBy().getName());
            }
            return dto;
        }
    }
}
