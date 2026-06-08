package com.gangstaneli.mindaura;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/grief")
@CrossOrigin(origins = "*")
public class GriefController {

    private final GriefRepository griefRepository;

    public GriefController(GriefRepository griefRepository) {
        this.griefRepository = griefRepository;
    }

    @PostMapping
    public GriefEntry saveGriefEntry(@RequestBody GriefEntry entry) {
        return griefRepository.save(entry);
    }

    @GetMapping("/{userId}")
    public List<GriefEntry> getGriefEntries(@PathVariable Long userId) {
        return griefRepository.findByUserId(userId);
    }

    @DeleteMapping("/{id}")
    public void deleteGriefEntry(@PathVariable Long id) {
        griefRepository.deleteById(id);
    }

    
}
