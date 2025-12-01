package com.ifsuldeminas.escrud.dto;
import java.math.BigDecimal;
public record ProductRequestDTO(
        String sku,
        String name,
        String description,
        Integer minStock,
        BigDecimal costPrice,
        String location,
        Integer categoryId,
        Long defaultSupplierId
) {}
