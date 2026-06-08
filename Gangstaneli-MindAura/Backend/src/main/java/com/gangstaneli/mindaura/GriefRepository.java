package com.gangstaneli.mindaura;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GriefRepository extends JpaRepository<GriefEntry, Long> {
    List<GriefEntry> findByUserId(Long userId);

    
}
