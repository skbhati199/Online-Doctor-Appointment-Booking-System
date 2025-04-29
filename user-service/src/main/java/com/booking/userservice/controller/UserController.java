package com.booking.userservice.controller;

import com.booking.userservice.dto.UserDto;
import com.booking.userservice.model.User;
import com.booking.userservice.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        UserDto.UserProfileResponse profileResponse = new UserDto.UserProfileResponse();
        profileResponse.setId(user.getId());
        profileResponse.setUsername(user.getUsername());
        profileResponse.setEmail(user.getEmail());
        profileResponse.setFirstName(user.getFirstName());
        profileResponse.setLastName(user.getLastName());
        profileResponse.setPhoneNumber(user.getPhoneNumber());
        profileResponse.setRoles(user.getRoles());
        
        return ResponseEntity.ok(profileResponse);
    }
    
    @PutMapping("/profile")
    public ResponseEntity<?> updateUserProfile(@RequestBody UserDto.UserProfileResponse profileRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Update user profile fields
        if (profileRequest.getFirstName() != null) {
            user.setFirstName(profileRequest.getFirstName());
        }
        
        if (profileRequest.getLastName() != null) {
            user.setLastName(profileRequest.getLastName());
        }
        
        if (profileRequest.getPhoneNumber() != null) {
            user.setPhoneNumber(profileRequest.getPhoneNumber());
        }
        
        userRepository.save(user);
        
        return ResponseEntity.ok(new UserDto.MessageResponse("Profile updated successfully"));
    }
    
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }
}