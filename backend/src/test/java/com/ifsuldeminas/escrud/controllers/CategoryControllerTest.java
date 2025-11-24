package com.ifsuldeminas.escrud.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ifsuldeminas.escrud.dto.CategoryRequestDTO;
import com.ifsuldeminas.escrud.dto.CategoryResponseDTO;
import com.ifsuldeminas.escrud.service.CategoryService;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CategoryController.class)
@AutoConfigureMockMvc(addFilters = false)
class CategoryControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @MockitoBean private CategoryService service;

    // ADICIONADO: O Mock do JwtService para o filtro de segurança não quebrar
    @MockitoBean private JwtService jwtService;

    @Test
    void findById_ShouldReturnCategory() throws Exception {
        CategoryResponseDTO dto = new CategoryResponseDTO(1, "Bebidas", true);
        when(service.findById(1)).thenReturn(dto);

        mockMvc.perform(get("/api/categories/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Bebidas"));
    }

    @Test
    void create_ShouldReturnCreatedCategory() throws Exception {
        CategoryRequestDTO req = new CategoryRequestDTO("Limpeza");
        CategoryResponseDTO resp = new CategoryResponseDTO(1, "Limpeza", true);

        when(service.create(any(CategoryRequestDTO.class))).thenReturn(resp);

        mockMvc.perform(post("/api/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Limpeza"));
    }
}