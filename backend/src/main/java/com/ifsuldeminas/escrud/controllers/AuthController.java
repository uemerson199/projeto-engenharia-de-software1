package com.ifsuldeminas.escrud.controllers;

import com.ifsuldeminas.escrud.dto.LoginRequestDTO;
import com.ifsuldeminas.escrud.dto.LoginResponseDTO;
import com.ifsuldeminas.escrud.dto.RegisterRequestDTO;
import com.ifsuldeminas.escrud.entities.User;
import com.ifsuldeminas.escrud.repositories.UserRepository;
import com.ifsuldeminas.escrud.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO loginRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.login(),
                        loginRequest.password()
                )
        );

        User user = userRepository.findByLogin(loginRequest.login())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtService.generateToken(user);

        LoginResponseDTO response = new LoginResponseDTO(
                token,
                user.getId(),
                user.getName(),
                user.getRole()
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponseDTO> register(@RequestBody RegisterRequestDTO registerRequest) {

        if (this.userRepository.findByLogin(registerRequest.login()).isPresent()) {
            return ResponseEntity.badRequest().build();
        }

        User newUser = new User();
        newUser.setName(registerRequest.name());
        newUser.setLogin(registerRequest.login());
        newUser.setPasswordHash(passwordEncoder.encode(registerRequest.password()));
        newUser.setRole(registerRequest.role());

        this.userRepository.save(newUser);

        String token = this.jwtService.generateToken(newUser);

        LoginResponseDTO response = new LoginResponseDTO(
                token,
                newUser.getId(),
                newUser.getName(),
                newUser.getRole()
        );

        return ResponseEntity.ok(response);
    }
}