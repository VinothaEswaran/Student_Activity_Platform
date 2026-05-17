package com.studentplatform.controller;

import com.studentplatform.dto.EventDto;
import com.studentplatform.model.Event;
import com.studentplatform.model.User;
import com.studentplatform.repository.EventRepository;
import com.studentplatform.repository.UserRepository;
import com.studentplatform.service.NotificationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    private User getCurrentUser(Authentication auth) {
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping
    public ResponseEntity<List<EventDto.EventResponse>> getAllEvents(Authentication auth) {
        User currentUser = getCurrentUser(auth);
        List<Event> events = eventRepository.findAll();
        List<EventDto.EventResponse> dtos = events.stream()
                .map(e -> EventDto.EventResponse.from(e, e.getRegisteredUsers().contains(currentUser)))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/public")
    public ResponseEntity<List<EventDto.EventResponse>> getPublicEvents() {
        List<Event> events = eventRepository.findAll();
        return ResponseEntity.ok(events.stream()
                .map(e -> EventDto.EventResponse.from(e, false))
                .collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventDto.EventResponse> getEvent(@PathVariable Long id, Authentication auth) {
        User currentUser = getCurrentUser(auth);
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        return ResponseEntity.ok(EventDto.EventResponse.from(event,
                event.getRegisteredUsers().contains(currentUser)));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<EventDto.EventResponse>> getByCategory(
            @PathVariable Event.Category category, Authentication auth) {
        User currentUser = getCurrentUser(auth);
        return ResponseEntity.ok(eventRepository.findByCategory(category).stream()
                .map(e -> EventDto.EventResponse.from(e, e.getRegisteredUsers().contains(currentUser)))
                .collect(Collectors.toList()));
    }

    @GetMapping("/search")
    public ResponseEntity<List<EventDto.EventResponse>> searchEvents(
            @RequestParam String keyword, Authentication auth) {
        User currentUser = getCurrentUser(auth);
        return ResponseEntity.ok(eventRepository.searchByKeyword(keyword).stream()
                .map(e -> EventDto.EventResponse.from(e, e.getRegisteredUsers().contains(currentUser)))
                .collect(Collectors.toList()));
    }

    @GetMapping("/my-registrations")
    public ResponseEntity<List<EventDto.EventResponse>> getMyRegistrations(Authentication auth) {
        User currentUser = getCurrentUser(auth);
        return ResponseEntity.ok(eventRepository.findRegisteredEventsByUserId(currentUser.getId()).stream()
                .map(e -> EventDto.EventResponse.from(e, true))
                .collect(Collectors.toList()));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ORGANIZER','ADMIN')")
    public ResponseEntity<EventDto.EventResponse> createEvent(
            @Valid @RequestBody EventDto.CreateRequest request, Authentication auth) {
        User currentUser = getCurrentUser(auth);

        Event event = new Event();
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setVenue(request.getVenue());
        event.setEventDate(request.getEventDate());
        event.setRegistrationDeadline(request.getRegistrationDeadline());
        event.setCategory(request.getCategory());
        event.setMaxParticipants(request.getMaxParticipants());
        event.setImageUrl(request.getImageUrl());
        event.setOrganizer(request.getOrganizer() != null ? request.getOrganizer() : currentUser.getName());
        event.setCreatedBy(currentUser);

        Event saved = eventRepository.save(event);
        return ResponseEntity.ok(EventDto.EventResponse.from(saved, false));
    }

    @PostMapping("/{id}/register")
    public ResponseEntity<?> registerForEvent(@PathVariable Long id, Authentication auth) {
        User currentUser = getCurrentUser(auth);
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (event.getRegisteredUsers().contains(currentUser)) {
            return ResponseEntity.badRequest().body("Already registered for this event");
        }
        if (event.getMaxParticipants() > 0 &&
                event.getRegisteredUsers().size() >= event.getMaxParticipants()) {
            return ResponseEntity.badRequest().body("Event is full");
        }

        event.getRegisteredUsers().add(currentUser);
        eventRepository.save(event);

        notificationService.sendNotification(
                currentUser,
                "Registration Confirmed!",
                "You have successfully registered for: " + event.getTitle(),
                com.studentplatform.model.Notification.Type.REGISTRATION_CONFIRM
        );

        return ResponseEntity.ok("Successfully registered for the event!");
    }

    @DeleteMapping("/{id}/register")
    public ResponseEntity<?> unregisterFromEvent(@PathVariable Long id, Authentication auth) {
        User currentUser = getCurrentUser(auth);
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        event.getRegisteredUsers().remove(currentUser);
        eventRepository.save(event);

        return ResponseEntity.ok("Successfully unregistered from the event.");
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ORGANIZER','ADMIN')")
    public ResponseEntity<EventDto.EventResponse> updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody EventDto.CreateRequest request,
            Authentication auth) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setVenue(request.getVenue());
        event.setEventDate(request.getEventDate());
        event.setRegistrationDeadline(request.getRegistrationDeadline());
        event.setCategory(request.getCategory());
        event.setMaxParticipants(request.getMaxParticipants());
        event.setImageUrl(request.getImageUrl());

        Event saved = eventRepository.save(event);
        User currentUser = getCurrentUser(auth);
        return ResponseEntity.ok(EventDto.EventResponse.from(saved,
                saved.getRegisteredUsers().contains(currentUser)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ORGANIZER','ADMIN')")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        eventRepository.deleteById(id);
        return ResponseEntity.ok("Event deleted successfully");
    }
}
