package com.ifsuldeminas.escrud.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ifsuldeminas.escrud.dto.DepartmentRequestDTO;
import com.ifsuldeminas.escrud.dto.DepartmentResponseDTO;
import com.ifsuldeminas.escrud.service.DepartmentService;
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

@WebMvcTest(DepartmentController.class)
@AutoConfigureMockMvc(addFilters = false)
class DepartmentControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @MockitoBean private DepartmentService service;

    // ADICIONADO: O Mock do JwtService para o filtro de segurança não quebrar
    @MockitoBean private JwtService jwtService;

    @Test
    void create_ShouldReturnDepartment() throws Exception {
        DepartmentRequestDTO req = new DepartmentRequestDTO("RH");
        DepartmentResponseDTO resp = new DepartmentResponseDTO(1, "RH", true);

        when(service.create(any(DepartmentRequestDTO.class))).thenReturn(resp);

        mockMvc.perform(post("/api/departments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("RH"));
    }
}