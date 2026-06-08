package com.gangstaneli.mindaura;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/moods")
@CrossOrigin(origins = "*")
public class MoodController {

    private final MoodRepository moodRepository;

    public MoodController(MoodRepository moodRepository) {
        this.moodRepository = moodRepository;
    }

    @PostMapping
    public MoodEntry saveMood(@RequestBody MoodEntry mood) {
        if (mood.getAuraColor() == null || mood.getAuraColor().isEmpty()) {
            mood.setAuraColor(getAuraColor(mood.getMood()));
        }

        return moodRepository.save(mood);
    }

    @GetMapping("/{userId}")
    public List<MoodEntry> getMoods(@PathVariable Long userId) {
        return moodRepository.findByUserId(userId);
    }

    @DeleteMapping("/{id}")
    public void deleteMood(@PathVariable Long id) {
        moodRepository.deleteById(id);
    }

    private String getAuraColor(String mood) {
        if (mood == null) return "green";

        String lowerMood = mood.toLowerCase();

        if (lowerMood.contains("happy")) return "gold";
        if (lowerMood.contains("sad")) return "blue";
        if (lowerMood.contains("angry")) return "red";
        if (lowerMood.contains("anxious")) return "purple";
        if (lowerMood.contains("calm")) return "teal";

        return "green";
    }

    
}
