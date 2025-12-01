package com.ifsuldeminas.escrud.dto;

import java.math.BigDecimal;
import java.util.List;

public record DashboardResponseDTO(
        BigDecimal totalStockValue,
        List<LowStockItemDTO> lowStockItems,
        List<StockMovementResponseDTO> recentMovements
) {}