package com.example.spring_cap;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000, http://localhost:55289", allowCredentials = "true")
public class UserController {
    private final UserRepository userRepository;
    private final FavoriteRepository favoriteRepository;
    private final BookingRepository bookingRepository;

    public UserController(UserRepository userRepository, FavoriteRepository favoriteRepository, BookingRepository bookingRepository) {
        this.userRepository = userRepository;
        this.favoriteRepository = favoriteRepository;
        this.bookingRepository = bookingRepository;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already exists"));
        }
        UserType userType = userRepository.count() == 0 ? UserType.ADMIN : UserType.USER;
        user.setType(userType);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent() && existingUser.get().getPassword().equals(user.getPassword())) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("name", existingUser.get().getName());
            response.put("email", existingUser.get().getEmail()); // Include email in the response
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body(Map.of("message", "Invalid credentials"));
    }

    @GetMapping("/isAdmin")
    public ResponseEntity<?> isAdmin(@RequestParam String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent() && user.get().getType() == UserType.ADMIN) {
            return ResponseEntity.ok(Map.of("isAdmin", true));
        }
        return ResponseEntity.ok(Map.of("isAdmin", false));
    }

    @GetMapping("/favorites")
    public ResponseEntity<?> getFavorites(@RequestParam String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            // Fetch favorites for the user
            return ResponseEntity.ok(favoriteRepository.findByUser(user.get()));
        }
        return ResponseEntity.badRequest().body(Map.of("message", "User not found"));
    }

    @GetMapping("/bookings")
    public ResponseEntity<?> getBookings(@RequestParam String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            // Fetch bookings for the user
            return ResponseEntity.ok(bookingRepository.findByUser(user.get()));
        }
        return ResponseEntity.badRequest().body(Map.of("message", "User not found"));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}