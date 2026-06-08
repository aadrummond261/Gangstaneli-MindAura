package com.gangstaneli.mindaura;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/medications")
@CrossOrigin(origins = "*")
public class MedicationController {

    private final MedicationRepository medicationRepository;

    public MedicationController(MedicationRepository medicationRepository) {
        this.medicationRepository = medicationRepository;
    }

    @PostMapping
    public Medication saveMedication(@RequestBody Medication medication) {
        return medicationRepository.save(medication);
    }

    @GetMapping("/{userId}")
    public List<Medication> getMedications(@PathVariable Long userId) {
        return medicationRepository.findByUserId(userId);
    }

    @DeleteMapping("/{id}")
    public void deleteMedication(@PathVariable Long id) {
        medicationRepository.deleteById(id);
    }

    
}
