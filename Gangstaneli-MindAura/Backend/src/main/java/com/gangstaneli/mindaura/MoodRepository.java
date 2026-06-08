package com.gangstaneli.mindaura;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MoodRepository extends JpaRepository<MoodEntry, Long> {
    List<MoodEntry> findByUserId(Long userId);
}
