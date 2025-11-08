package com.ifsuldeminas.escrud.controllers;

import com.ifsuldeminas.escrud.dto.LoginRequestDTO;
import com.ifsuldeminas.escrud.dto.LoginResponseDTO;
import com.ifsuldeminas.escrud.entities.User;
import com.ifsuldeminas.escrud.repositories.UserRepository;
import com.ifsuldeminas.escrud.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    // Injetando as dependências que configuramos
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest) {
        
        // 1. Autenticar o usuário
        // O Spring Security vai usar o UserDetailsService e o PasswordEncoder
        // que configuramos no SecurityConfig para validar o login e senha.
        // Se a autenticação falhar, ele lança uma exceção (que o Spring trata
        // e retorna um erro 401 ou 403).
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.login(),
                        loginRequest.password()
                )
        );

        // 2. Se a autenticação foi bem-sucedida, buscar o usuário
        // Usamos '.orElseThrow()' para garantir que o usuário existe
        // (o que é garantido pela autenticação acima)
        User user = userRepository.findByLogin(loginRequest.login())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado após autenticação"));

        // 3. Gerar o Token JWT
        String token = jwtService.generateToken(user);

        // 4. Criar o DTO de Resposta
        LoginResponseDTO response = new LoginResponseDTO(
                token,
                user.getId(),
                user.getName(),
                user.getRole()
        );

        // 5. Retornar a resposta com o token
        return ResponseEntity.ok(response);
    }
}