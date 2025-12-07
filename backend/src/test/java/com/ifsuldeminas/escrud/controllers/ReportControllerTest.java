package com.ifsuldeminas.escrud.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ifsuldeminas.escrud.dto.DashboardResponseDTO;
import com.ifsuldeminas.escrud.dto.DepartmentConsumptionDTO;
import com.ifsuldeminas.escrud.service.JwtService;
import com.ifsuldeminas.escrud.service.ReportService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ReportController.class)
@AutoConfigureMockMvc(addFilters = false)
class ReportControllerTest {

    @Autowired private MockMvc mockMvc;

    @MockitoBean private ReportService service;
    @MockitoBean private JwtService jwtService;

    @Test
    void getDashboard_ShouldReturnOk() throws Exception {
        // CORREÇÃO: Preenchendo os 3 argumentos do DashboardResponseDTO
        // (Valor Total, Lista de Estoque Baixo, Lista de Movimentações)
        DashboardResponseDTO response = new DashboardResponseDTO(
                BigDecimal.ZERO,
                Collections.emptyList(),
                Collections.emptyList()
        );

        when(service.getDashboardData()).thenReturn(response);

        mockMvc.perform(get("/api/relatorios/dashboard"))
                .andExpect(status().isOk());
    }

    @Test
    void getConsumptionReport_ShouldReturnOk() throws Exception {
        // CORREÇÃO: Criando a estrutura aninhada do DepartmentConsumptionResponse
        var deptInfo = new DepartmentConsumptionDTO.DeptInfo(1, "TI");

        var responseItem = new DepartmentConsumptionDTO.DepartmentConsumptionResponse(
                deptInfo,           // DeptInfo
                BigDecimal.TEN,     // TotalValue
                5L                  // ItemsConsumed
        );

        when(service.getConsumptionByDepartment(any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(List.of(responseItem));

        mockMvc.perform(get("/api/relatorios/consumo-departamento")
                        .param("dataInicio", "2025-01-01")
                        .param("dataFim", "2025-01-31"))
                .andExpect(status().isOk());
    }
}