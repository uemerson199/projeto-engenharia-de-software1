package com.ifsuldeminas.escrud.dto;

import com.ifsuldeminas.escrud.entities.MovementType;

import java.time.LocalDateTime;

public record StockMovementResponseDTO(
        Long id,
        LocalDateTime dateTime,
        MovementType type,
        int quantity,
        String reason,
        String productName,
        String departmentName,
        String supplierName,
        String userName // Nome do usuário que fez a ação
) {}