package com.ifsuldeminas.escrud.dto;

public record LowStockItemDTO(
        Long id,
        String sku,
        String name,
        int quantityInStock,
        int minStock
) {}