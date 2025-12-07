package com.ifsuldeminas.escrud.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ifsuldeminas.escrud.dto.SupplierRequestDTO;
import com.ifsuldeminas.escrud.dto.SupplierResponseDTO;
import com.ifsuldeminas.escrud.service.JwtService;
import com.ifsuldeminas.escrud.service.SupplierService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(SupplierController.class)
@AutoConfigureMockMvc(addFilters = false)
class SupplierControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @MockitoBean private SupplierService service;
    @MockitoBean private JwtService jwtService;

    @Test
    void findAll_ShouldReturnPage() throws Exception {
        // CORREÇÃO: Declarando o tipo explícito da Page para evitar erro de compilação
        Page<SupplierResponseDTO> page = new PageImpl<>(Collections.emptyList());

        when(service.findAll(any(Pageable.class), any())).thenReturn(page);

        mockMvc.perform(get("/api/suppliers")
                        .param("name", "Test"))
                .andExpect(status().isOk());
    }

    @Test
    void findAllActive_ShouldReturnList() throws Exception {
        SupplierResponseDTO response = new SupplierResponseDTO(1L, "Coca-Cola", "email@test.com", true);
        when(service.findAllActive()).thenReturn(List.of(response));

        mockMvc.perform(get("/api/suppliers/active"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Coca-Cola"));
    }

    @Test
    void findById_ShouldReturnSupplier() throws Exception {
        SupplierResponseDTO response = new SupplierResponseDTO(1L, "Coca-Cola", "email@test.com", true);
        when(service.findById(1L)).thenReturn(response);

        mockMvc.perform(get("/api/suppliers/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Coca-Cola"));
    }

    @Test
    void create_ShouldReturnCreated() throws Exception {
        SupplierRequestDTO request = new SupplierRequestDTO("Coca-Cola", "email@test.com");
        SupplierResponseDTO response = new SupplierResponseDTO(1L, "Coca-Cola", "email@test.com", true);

        when(service.create(any(SupplierRequestDTO.class))).thenReturn(response);

        mockMvc.perform(post("/api/suppliers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("Coca-Cola"));
    }

    @Test
    void update_ShouldReturnUpdatedSupplier() throws Exception {
        SupplierRequestDTO request = new SupplierRequestDTO("Coca-Cola Update", "novo@email.com");
        SupplierResponseDTO response = new SupplierResponseDTO(1L, "Coca-Cola Update", "novo@email.com", true);

        when(service.update(eq(1L), any(SupplierRequestDTO.class))).thenReturn(response);

        mockMvc.perform(put("/api/suppliers/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Coca-Cola Update"));
    }

    @Test
    void delete_ShouldReturnNoContent() throws Exception {
        doNothing().when(service).delete(1L);

        mockMvc.perform(delete("/api/suppliers/1"))
                .andExpect(status().isNoContent());
    }
}