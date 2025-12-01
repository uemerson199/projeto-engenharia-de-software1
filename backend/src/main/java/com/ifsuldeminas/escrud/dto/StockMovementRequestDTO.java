package com.ifsuldeminas.escrud.dto;

import com.ifsuldeminas.escrud.entities.MovementType;

public record StockMovementRequestDTO(
        Long productId,
        int quantity,
        MovementType type,
        Integer departmentId,
        Long supplierId,
        String reason
) {}