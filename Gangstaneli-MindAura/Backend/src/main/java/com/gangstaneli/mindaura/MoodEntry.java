
package com.gangstaneli.mindaura;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class MoodEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String mood;
    private String emoji;
    private String note;
    private Integer energyLevel;
    private String auraColor;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public String getMood() { return mood; }
    public String getEmoji() { return emoji; }
    public String getNote() { return note; }
    public Integer getEnergyLevel() { return energyLevel; }
    public String getAuraColor() { return auraColor; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setId(Long id) { this.id = id; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setMood(String mood) { this.mood = mood; }
    public void setEmoji(String emoji) { this.emoji = emoji; }
    public void setNote(String note) { this.note = note; }
    public void setEnergyLevel(Integer energyLevel) { this.energyLevel = energyLevel; }
    public void setAuraColor(String auraColor) { this.auraColor = auraColor; }
}
