package com.gangstaneli.mindaura;
import jakarta.persistence.*;

@Entity
public class Medication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String name;
    private String dosage;
    private String reminderTime;
    private String purpose;
    private String sideEffects;

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public String getName() { return name; }
    public String getDosage() { return dosage; }
    public String getReminderTime() { return reminderTime; }
    public String getPurpose() { return purpose; }
    public String getSideEffects() { return sideEffects; }

    public void setId(Long id) { this.id = id; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setName(String name) { this.name = name; }
    public void setDosage(String dosage) { this.dosage = dosage; }
    public void setReminderTime(String reminderTime) { this.reminderTime = reminderTime; }
    public void setPurpose(String purpose) { this.purpose = purpose; }
    public void setSideEffects(String sideEffects) { this.sideEffects = sideEffects; }
 {
    
}
}
