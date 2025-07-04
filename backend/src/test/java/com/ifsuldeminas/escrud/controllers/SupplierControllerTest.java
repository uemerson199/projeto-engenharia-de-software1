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

    //forçando a execução do WorkFlow

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private SupplierService supplierService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("GET /api/suppliers/{id} deve retornar um fornecedor completo")
    void testFindById() throws Exception {
        SupplierDTO dto = new SupplierDTO(1L, "Fornecedor A", "Contato A", "123456", "a@a.com", "00.000.000/0000-00");

        Mockito.when(supplierService.findById(1L)).thenReturn(dto);

        mockMvc.perform(get("/api/suppliers/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("Fornecedor A"))
                .andExpect(jsonPath("$.contactName").value("Contato A"))
                .andExpect(jsonPath("$.phone").value("123456"))
                .andExpect(jsonPath("$.email").value("a@a.com"))
                .andExpect(jsonPath("$.cnpj").value("00.000.000/0000-00"));
    }

    @Test
    @DisplayName("GET /api/suppliers deve retornar todos os fornecedores completos")
    void testFindAll() throws Exception {
        List<SupplierDTO> list = Arrays.asList(
                new SupplierDTO(1L, "Fornecedor A", "Contato A", "123456", "a@a.com", "00.000.000/0000-00"),
                new SupplierDTO(2L, "Fornecedor B", "Contato B", "654321", "b@b.com", "11.111.111/1111-11")
        );

        Mockito.when(supplierService.findAll()).thenReturn(list);

        mockMvc.perform(get("/api/suppliers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(2))
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].name").value("Fornecedor A"))
                .andExpect(jsonPath("$[0].contactName").value("Contato A"))
                .andExpect(jsonPath("$[0].phone").value("123456"))
                .andExpect(jsonPath("$[0].email").value("a@a.com"))
                .andExpect(jsonPath("$[0].cnpj").value("00.000.000/0000-00"))
                .andExpect(jsonPath("$[1].id").value(2L))
                .andExpect(jsonPath("$[1].name").value("Fornecedor B"))
                .andExpect(jsonPath("$[1].contactName").value("Contato B"))
                .andExpect(jsonPath("$[1].phone").value("654321"))
                .andExpect(jsonPath("$[1].email").value("b@b.com"))
                .andExpect(jsonPath("$[1].cnpj").value("11.111.111/1111-11"));
    }

    @Test
    @DisplayName("POST /api/suppliers deve criar um novo fornecedor completo")
    void testInsert() throws Exception {
        SupplierDTO dtoToCreate = new SupplierDTO(null, "Novo Fornecedor", "Contato Novo", "999999", "novo@fornecedor.com", "22.222.222/2222-22");
        SupplierDTO dtoCreated = new SupplierDTO(3L, "Novo Fornecedor", "Contato Novo", "999999", "novo@fornecedor.com", "22.222.222/2222-22");

        Mockito.when(supplierService.insert(any(SupplierDTO.class))).thenReturn(dtoCreated);

        mockMvc.perform(post("/api/suppliers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dtoToCreate)))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "http://localhost/api/suppliers/3"))
                .andExpect(jsonPath("$.id").value(3L))
                .andExpect(jsonPath("$.name").value("Novo Fornecedor"))
                .andExpect(jsonPath("$.contactName").value("Contato Novo"))
                .andExpect(jsonPath("$.phone").value("999999"))
                .andExpect(jsonPath("$.email").value("novo@fornecedor.com"))
                .andExpect(jsonPath("$.cnpj").value("22.222.222/2222-22"));
    }

    @Test
    @DisplayName("PUT /api/suppliers/{id} deve atualizar um fornecedor completo")
    void testUpdate() throws Exception {
        SupplierDTO dtoToUpdate = new SupplierDTO(null, "Fornecedor Atualizado", "Contato Atualizado", "888888", "atualizado@fornecedor.com", "33.333.333/3333-33");
        SupplierDTO dtoUpdated = new SupplierDTO(1L, "Fornecedor Atualizado", "Contato Atualizado", "888888", "atualizado@fornecedor.com", "33.333.333/3333-33");

        Mockito.when(supplierService.update(eq(1L), any(SupplierDTO.class))).thenReturn(dtoUpdated);

        mockMvc.perform(put("/api/suppliers/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dtoToUpdate)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("Fornecedor Atualizado"))
                .andExpect(jsonPath("$.contactName").value("Contato Atualizado"))
                .andExpect(jsonPath("$.phone").value("888888"))
                .andExpect(jsonPath("$.email").value("atualizado@fornecedor.com"))
                .andExpect(jsonPath("$.cnpj").value("33.333.333/3333-33"));
    }

    @Test
    @DisplayName("DELETE /api/suppliers/{id} deve excluir um fornecedor")
    void testDelete() throws Exception {
        Mockito.doNothing().when(supplierService).delete(1L);

        mockMvc.perform(delete("/api/suppliers/1"))
                .andExpect(status().isNoContent());
    }
}
