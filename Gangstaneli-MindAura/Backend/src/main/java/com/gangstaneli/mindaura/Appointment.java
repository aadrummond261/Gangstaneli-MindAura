package com.gangstaneli.mindaura;
import jakarta.persistence.*;

@Entity
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String title;
    private String providerName;
    private String date;
    private String time;
    private String notes;

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public String getTitle() { return title; }
    public String getProviderName() { return providerName; }
    public String getDate() { return date; }
    public String getTime() { return time; }
    public String getNotes() { return notes; }

    public void setId(Long id) { this.id = id; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setTitle(String title) { this.title = title; }
    public void setProviderName(String providerName) { this.providerName = providerName; }
    public void setDate(String date) { this.date = date; }
    public void setTime(String time) { this.time = time; }
    public void setNotes(String notes) { this.notes = notes; }
}


