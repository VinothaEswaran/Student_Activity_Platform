package com.studentplatform.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String venue;

    @Column(nullable = false)
    private LocalDateTime eventDate;

    private LocalDateTime registrationDeadline;

    @Enumerated(EnumType.STRING)
    private Category category;

    @Enumerated(EnumType.STRING)
    private Status status = Status.UPCOMING;

    private int maxParticipants;
    private String imageUrl;
    private String organizer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "event_registrations",
        joinColumns = @JoinColumn(name = "event_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> registeredUsers = new HashSet<>();

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public int getRegisteredCount() {
        return registeredUsers.size();
    }

    public enum Category {
        TECHNICAL, CULTURAL, SPORTS, WORKSHOP, SEMINAR, HACKATHON, OTHER
    }

    public enum Status {
        UPCOMING, ONGOING, COMPLETED, CANCELLED
    }
}
