package com.ifsuldeminas.escrud.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ifsuldeminas.escrud.dto.LoginRequestDTO;
import com.ifsuldeminas.escrud.dto.RegisterRequestDTO;
import com.ifsuldeminas.escrud.entities.User;
import com.ifsuldeminas.escrud.repositories.UserRepository;
import com.ifsuldeminas.escrud.service.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
// Atualizado para Spring Boot 3.4+:
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    // Substituindo @MockBean (deprecated) por @MockitoBean
    @MockitoBean private AuthenticationManager authenticationManager;
    @MockitoBean private JwtService jwtService;
    @MockitoBean private UserRepository userRepository;
    @MockitoBean private PasswordEncoder passwordEncoder;

    @Test
    void login_ShouldReturnToken_WhenCredentialsAreValid() throws Exception {
        LoginRequestDTO loginReq = new LoginRequestDTO("admin", "123456");
        User mockUser = new User();
        // CORREÇÃO: Mudamos de 1L para 1 (Integer)
        mockUser.setId(1);
        mockUser.setName("Admin");
        mockUser.setRole("GERENTE");

        when(userRepository.findByLogin("admin")).thenReturn(Optional.of(mockUser));
        when(jwtService.generateToken(any(User.class))).thenReturn("fake-jwt-token");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("fake-jwt-token"));
    }

    @Test
    void register_ShouldReturnToken_WhenUserIsNew() throws Exception {
        RegisterRequestDTO registerReq = new RegisterRequestDTO("Novo", "novo", "123", "CAIXA");
        User savedUser = new User();
        // CORREÇÃO: Mudamos de 2L para 2 (Integer)
        savedUser.setId(2);
        savedUser.setName("Novo");

        when(userRepository.findByLogin("novo")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(jwtService.generateToken(any(User.class))).thenReturn("new-token");
        when(passwordEncoder.encode(any())).thenReturn("encoded-pass");

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("new-token"));
    }
}