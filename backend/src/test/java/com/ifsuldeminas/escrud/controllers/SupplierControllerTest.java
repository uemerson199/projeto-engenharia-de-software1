package com.ifsuldeminas.escrud.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ifsuldeminas.escrud.dto.SupplierDTO;
import com.ifsuldeminas.escrud.service.SupplierService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SupplierController.class)
class SupplierControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private SupplierService supplierService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("GET /api/suppliers/{id} deve retornar um fornecedor completo")
    void testFindById() throws Exception {
        // Ajustado para o novo construtor: ID, Nome, ContactInfo, Active
        SupplierDTO dto = new SupplierDTO(1L, "Fornecedor A", "Contato A", true);

        Mockito.when(supplierService.findById(1L)).thenReturn(dto);

        mockMvc.perform(get("/api/suppliers/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("Fornecedor A"))
                .andExpect(jsonPath("$.contactInfo").value("Contato A")) // contactName virou contactInfo
                .andExpect(jsonPath("$.active").value(true)); // Novo campo
        // Removidos phone, email e cnpj
    }

    @Test
    @DisplayName("GET /api/suppliers deve retornar todos os fornecedores completos")
    void testFindAll() throws Exception {
        List<SupplierDTO> list = Arrays.asList(
                new SupplierDTO(1L, "Fornecedor A", "Contato A", true),
                new SupplierDTO(2L, "Fornecedor B", "Contato B", true)
        );

        Mockito.when(supplierService.findAll()).thenReturn(list);

        mockMvc.perform(get("/api/suppliers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(2))
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].name").value("Fornecedor A"))
                .andExpect(jsonPath("$[0].contactInfo").value("Contato A"))
                .andExpect(jsonPath("$[1].id").value(2L))
                .andExpect(jsonPath("$[1].name").value("Fornecedor B"))
                .andExpect(jsonPath("$[1].contactInfo").value("Contato B"));
    }

    @Test
    @DisplayName("POST /api/suppliers deve criar um novo fornecedor completo")
    void testInsert() throws Exception {
        // DTO de entrada (sem ID)
        SupplierDTO dtoToCreate = new SupplierDTO(null, "Novo Fornecedor", "Contato Novo", true);
        // DTO de saída (com ID gerado)
        SupplierDTO dtoCreated = new SupplierDTO(3L, "Novo Fornecedor", "Contato Novo", true);

        Mockito.when(supplierService.insert(any(SupplierDTO.class))).thenReturn(dtoCreated);

        mockMvc.perform(post("/api/suppliers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dtoToCreate)))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "http://localhost/api/suppliers/3"))
                .andExpect(jsonPath("$.id").value(3L))
                .andExpect(jsonPath("$.name").value("Novo Fornecedor"))
                .andExpect(jsonPath("$.contactInfo").value("Contato Novo"))
                .andExpect(jsonPath("$.active").value(true));
    }

    @Test
    @DisplayName("PUT /api/suppliers/{id} deve atualizar um fornecedor completo")
    void testUpdate() throws Exception {
        SupplierDTO dtoToUpdate = new SupplierDTO(null, "Fornecedor Atualizado", "Contato Atualizado", true);
        SupplierDTO dtoUpdated = new SupplierDTO(1L, "Fornecedor Atualizado", "Contato Atualizado", true);

        Mockito.when(supplierService.update(eq(1L), any(SupplierDTO.class))).thenReturn(dtoUpdated);

        mockMvc.perform(put("/api/suppliers/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dtoToUpdate)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("Fornecedor Atualizado"))
                .andExpect(jsonPath("$.contactInfo").value("Contato Atualizado"));
    }

    @Test
    @DisplayName("DELETE /api/suppliers/{id} deve excluir um fornecedor")
    void testDelete() throws Exception {
        Mockito.doNothing().when(supplierService).delete(1L);

        mockMvc.perform(delete("/api/suppliers/1"))
                .andExpect(status().isNoContent());
    }
}