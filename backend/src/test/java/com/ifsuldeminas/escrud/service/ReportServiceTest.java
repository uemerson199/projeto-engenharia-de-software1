package com.ifsuldeminas.escrud.service;

import com.ifsuldeminas.escrud.dto.*;
import com.ifsuldeminas.escrud.entities.*;
import com.ifsuldeminas.escrud.repositories.ProductRepository;
import com.ifsuldeminas.escrud.repositories.StockMovementRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReportServiceTest {

    @InjectMocks
    private ReportService service;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private StockMovementRepository movementRepository;

    private StockMovement stockMovement;
    private Product product;
    private Department department;
    private Supplier supplier;
    private User user;

    @BeforeEach
    void setUp() {
        product = new Product();
        product.setId(1L);
        product.setName("Product A");

        department = new Department();
        department.setName("IT Dept");

        supplier = new Supplier();
        supplier.setName("Tech Supplier");

        user = new User();
        user.setName("Admin User");

        stockMovement = new StockMovement();
        stockMovement.setId(1L);
        stockMovement.setDateTime(LocalDateTime.now());
        stockMovement.setType(MovementType.ENTRADA_COMPRA);
        stockMovement.setQuantity(10);
        stockMovement.setReason("Purchase");
        stockMovement.setProduct(product);
        stockMovement.setDepartment(department);
        stockMovement.setSupplier(supplier);
        stockMovement.setUser(user);
    }

    @Test
    void getDashboardData_ShouldReturnData_WhenValuesExist() {
        BigDecimal expectedValue = new BigDecimal("5000.00");
        List<LowStockItemDTO> lowStockList = List.of(mock(LowStockItemDTO.class));
        List<StockMovement> movements = List.of(stockMovement);

        when(productRepository.getTotalStockValue()).thenReturn(expectedValue);
        when(productRepository.findLowStockItems()).thenReturn(lowStockList);
        when(movementRepository.findTop10ByOrderByDateTimeDesc()).thenReturn(movements);

        DashboardResponseDTO result = service.getDashboardData();

        assertNotNull(result);
        assertEquals(expectedValue, result.totalStockValue());
        assertEquals(1, result.lowStockItems().size());
        assertEquals(1, result.recentMovements().size());

        StockMovementResponseDTO movementDTO = result.recentMovements().get(0);
        assertEquals("Product A", movementDTO.productName());
        assertEquals("IT Dept", movementDTO.departmentName());
        assertEquals("Tech Supplier", movementDTO.supplierName());
        assertEquals("Admin User", movementDTO.userName());
    }

    @Test
    void getDashboardData_ShouldReturnZeroValue_WhenTotalIsNull() {
        when(productRepository.getTotalStockValue()).thenReturn(null);
        when(productRepository.findLowStockItems()).thenReturn(Collections.emptyList());
        when(movementRepository.findTop10ByOrderByDateTimeDesc()).thenReturn(Collections.emptyList());

        DashboardResponseDTO result = service.getDashboardData();

        assertNotNull(result);
        assertEquals(BigDecimal.ZERO, result.totalStockValue());
        assertTrue(result.lowStockItems().isEmpty());
        assertTrue(result.recentMovements().isEmpty());
    }

    @Test
    void getDashboardData_ShouldHandleNullEntitiesInMovement() {
        StockMovement movementNulls = new StockMovement();
        movementNulls.setId(2L);
        movementNulls.setProduct(product);
        movementNulls.setDepartment(null);
        movementNulls.setSupplier(null);
        movementNulls.setUser(null);

        when(productRepository.getTotalStockValue()).thenReturn(BigDecimal.ZERO);
        when(productRepository.findLowStockItems()).thenReturn(Collections.emptyList());
        when(movementRepository.findTop10ByOrderByDateTimeDesc()).thenReturn(List.of(movementNulls));

        DashboardResponseDTO result = service.getDashboardData();

        StockMovementResponseDTO dto = result.recentMovements().get(0);
        assertNull(dto.departmentName());
        assertNull(dto.supplierName());
        assertEquals("Unknown", dto.userName());
    }

    @Test
    void getConsumptionByDepartment_ShouldCallRepositoryWithCorrectDates() {
        LocalDate start = LocalDate.of(2023, 1, 1);
        LocalDate end = LocalDate.of(2023, 1, 31);

        LocalDateTime startDateTime = start.atStartOfDay();
        LocalDateTime endDateTime = end.atTime(23, 59, 59);

        when(movementRepository.getDepartmentConsumptionStats(any(), any(), any()))
                .thenReturn(Collections.emptyList());

        List<DepartmentConsumptionDTO.DepartmentConsumptionResponse> result =
                service.getConsumptionByDepartment(start, end);

        assertNotNull(result);
        verify(movementRepository).getDepartmentConsumptionStats(
                eq(startDateTime),
                eq(endDateTime),
                eq(MovementType.SAIDA_REQUISICAO)
        );
    }
}