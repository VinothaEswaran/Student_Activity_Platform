package com.studentplatform.repository;

import com.studentplatform.model.Event;
import com.studentplatform.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByCategory(Event.Category category);
    List<Event> findByStatus(Event.Status status);
    List<Event> findByCreatedBy(User user);

    @Query("SELECT e FROM Event e WHERE e.title LIKE %:keyword% OR e.description LIKE %:keyword%")
    List<Event> searchByKeyword(String keyword);

    @Query("SELECT e FROM Event e JOIN e.registeredUsers u WHERE u.id = :userId")
    List<Event> findRegisteredEventsByUserId(Long userId);
}
