package com.ifsuldeminas.escrud.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ifsuldeminas.escrud.dto.SupplierRequestDTO;
import com.ifsuldeminas.escrud.dto.SupplierResponseDTO;
import com.ifsuldeminas.escrud.service.SupplierService;
import com.ifsuldeminas.escrud.service.JwtService; // Import necessário
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(SupplierController.class)
@AutoConfigureMockMvc(addFilters = false)
class SupplierControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @MockitoBean private SupplierService service;

    // ADICIONADO: O Mock do JwtService para o filtro de segurança não quebrar
    @MockitoBean private JwtService jwtService;

    @Test
    void create_ShouldReturnSupplier() throws Exception {
        SupplierRequestDTO req = new SupplierRequestDTO("Coca-Cola", "coca@email.com");
        SupplierResponseDTO resp = new SupplierResponseDTO(1L, "Coca-Cola", "coca@email.com", true);

        when(service.create(any(SupplierRequestDTO.class))).thenReturn(resp);

        mockMvc.perform(post("/api/suppliers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Coca-Cola"));
    }
}