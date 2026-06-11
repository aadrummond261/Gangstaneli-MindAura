package com.gangstaneli.mindaura;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.time.LocalDateTime;

@Entity
public class GriefEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String lovedOneName;
    private String relationship;
    private String feelingToday;
    private String memoryNote;
    private String supportNeed;
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public String getLovedOneName() { return lovedOneName; }
    public String getRelationship() { return relationship; }
    public String getFeelingToday() { return feelingToday; }
    public String getMemoryNote() { return memoryNote; }
    public String getSupportNeed() { return supportNeed; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setId(Long id) { this.id = id; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setLovedOneName(String lovedOneName) { this.lovedOneName = lovedOneName; }
    public void setRelationship(String relationship) { this.relationship = relationship; }
    public void setFeelingToday(String feelingToday) { this.feelingToday = feelingToday; }
    public void setMemoryNote(String memoryNote) { this.memoryNote = memoryNote; }
    public void setSupportNeed(String supportNeed) { this.supportNeed = supportNeed; }
}
