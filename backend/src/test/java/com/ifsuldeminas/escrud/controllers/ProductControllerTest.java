package com.ifsuldeminas.escrud.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ifsuldeminas.escrud.dto.ProductRequestDTO;
import com.ifsuldeminas.escrud.dto.ProductResponseDTO;
import com.ifsuldeminas.escrud.service.JwtService;
import com.ifsuldeminas.escrud.service.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ProductController.class)
@AutoConfigureMockMvc(addFilters = false)
class ProductControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @MockitoBean private ProductService service;
    @MockitoBean private JwtService jwtService;

    @Test
    void findAll_ShouldReturnPage() throws Exception {
        when(service.findAll(any(Pageable.class), any(), any(), any()))
                .thenReturn(new PageImpl<>(Collections.emptyList()));

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk());
    }

    @Test
    void findById_ShouldReturnProduct() throws Exception {
        // CORREÇÃO: Preenchendo os 11 argumentos do ProductResponseDTO
        ProductResponseDTO response = new ProductResponseDTO(
                1L,                 // id
                "SKU-123",          // sku
                "Notebook",         // name
                "Notebook Dell",    // description
                10,                 // quantityInStock
                2,                  // minStock
                new BigDecimal("2500.00"), // costPrice
                "Corredor A",       // location
                true,               // active
                "Eletrônicos",      // categoryName
                "Dell Brasil"       // supplierName
        );

        when(service.findById(1L)).thenReturn(response);

        mockMvc.perform(get("/api/products/1"))
                .andExpect(status().isOk());
    }

    @Test
    void create_ShouldReturnCreated() throws Exception {
        // CORREÇÃO: Preenchendo os 8 argumentos do ProductRequestDTO
        ProductRequestDTO request = new ProductRequestDTO(
                "SKU-999",          // sku
                "Mouse",            // name
                "Mouse USB",        // description
                5,                  // minStock
                new BigDecimal("50.00"), // costPrice
                "Prateleira B",     // location
                1,                  // categoryId
                1L                  // defaultSupplierId
        );

        // Response simulado
        ProductResponseDTO response = new ProductResponseDTO(
                2L, "SKU-999", "Mouse", "Mouse USB", 0, 5,
                new BigDecimal("50.00"), "Prateleira B", true, "Periféricos", "Logitech"
        );

        when(service.create(any(ProductRequestDTO.class))).thenReturn(response);

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
    }

    @Test
    void delete_ShouldReturnNoContent() throws Exception {
        doNothing().when(service).delete(1L);

        mockMvc.perform(delete("/api/products/1"))
                .andExpect(status().isNoContent());
    }
}