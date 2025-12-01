package com.ifsuldeminas.escrud.service;

import com.ifsuldeminas.escrud.dto.*;
import com.ifsuldeminas.escrud.entities.MovementType;
import com.ifsuldeminas.escrud.entities.StockMovement;
import com.ifsuldeminas.escrud.repositories.ProductRepository;
import com.ifsuldeminas.escrud.repositories.StockMovementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ProductRepository productRepository;
    private final StockMovementRepository movementRepository;

    public DashboardResponseDTO getDashboardData() {

        BigDecimal totalValue = productRepository.getTotalStockValue();
        if (totalValue == null) totalValue = BigDecimal.ZERO;

        List<LowStockItemDTO> lowStockItems = productRepository.findLowStockItems();

        List<StockMovementResponseDTO> recentMovements = movementRepository.findTop10ByOrderByDateTimeDesc()
                .stream()
                .map(this::mapToMovementDTO)
                .toList();

        return new DashboardResponseDTO(totalValue, lowStockItems, recentMovements);
    }

    public List<DepartmentConsumptionDTO.DepartmentConsumptionResponse> getConsumptionByDepartment(LocalDate start, LocalDate end) {
        var startDateTime = start.atStartOfDay();
        var endDateTime = end.atTime(23, 59, 59);

        return movementRepository.getDepartmentConsumptionStats(
                        startDateTime,
                        endDateTime,
                        MovementType.SAIDA_REQUISICAO
                )
                .stream()
                .map(DepartmentConsumptionDTO::toResponse)
                .toList();
    }

    private StockMovementResponseDTO mapToMovementDTO(StockMovement entity) {
        return new StockMovementResponseDTO(
                entity.getId(),
                entity.getDateTime(),
                entity.getType(),
                entity.getQuantity(),
                entity.getReason(),
                entity.getProduct().getName(),
                entity.getDepartment() != null ? entity.getDepartment().getName() : null,
                entity.getSupplier() != null ? entity.getSupplier().getName() : null,
                entity.getUser() != null ? entity.getUser().getName() : "Unknown"
        );
    }
}