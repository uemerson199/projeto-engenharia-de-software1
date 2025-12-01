package com.ifsuldeminas.escrud.dto;
import java.math.BigDecimal;
public record ProductResponseDTO(
        Long id,
        String sku,
        String name,
        String description,
        int quantityInStock,
        int minStock,
        BigDecimal costPrice,
        String location,
        boolean active,
        String categoryName,
        String supplierName
) {}
