package com.ifsuldeminas.escrud.dto;
public record SupplierResponseDTO(
        Long id,
        String name,
        String contactInfo,
        boolean active
) {}
