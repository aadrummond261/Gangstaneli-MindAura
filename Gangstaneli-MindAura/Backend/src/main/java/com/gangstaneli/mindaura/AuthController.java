package com.gangstaneli.mindaura;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/signup")
    public User signup(@RequestBody User user) {
        return userRepository.save(user);
    }

    @PostMapping("/login")
    public Object login(@RequestBody User loginUser) {
        return userRepository.findByEmail(loginUser.getEmail())
                .filter(user -> user.getPassword().equals(loginUser.getPassword()))
                .orElse(null);
    }

    
}
