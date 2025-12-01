package com.ifsuldeminas.escrud.dto;

import java.math.BigDecimal;

public record DepartmentConsumptionDTO(
        Integer departmentId,
        String departmentName,
        BigDecimal totalValueConsumed,
        Long totalItemsConsumed
) {
    public DepartmentConsumptionResponse toResponse() {
        return new DepartmentConsumptionResponse(
                new DeptInfo(departmentId, departmentName),
                totalValueConsumed,
                totalItemsConsumed
        );
    }

    public record DeptInfo(Integer id, String name) {}

    public record DepartmentConsumptionResponse(
            DeptInfo department,
            BigDecimal totalValueConsumed,
            Long itemsConsumed
    ) {}
}