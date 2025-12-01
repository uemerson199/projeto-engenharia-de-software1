package com.ifsuldeminas.escrud.controllers;

import com.ifsuldeminas.escrud.dto.DashboardResponseDTO;
import com.ifsuldeminas.escrud.dto.DepartmentConsumptionDTO;
import com.ifsuldeminas.escrud.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/relatorios")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService service;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponseDTO> getDashboard() {
        return ResponseEntity.ok(service.getDashboardData());
    }

    @GetMapping("/consumo-departamento")
    public ResponseEntity<List<DepartmentConsumptionDTO.DepartmentConsumptionResponse>> getConsumptionReport(
            @RequestParam LocalDate dataInicio,
            @RequestParam LocalDate dataFim) {
        return ResponseEntity.ok(service.getConsumptionByDepartment(dataInicio, dataFim));
    }
}