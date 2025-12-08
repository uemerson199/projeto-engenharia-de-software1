package com.ifsuldeminas.escrud.service;

import com.ifsuldeminas.escrud.dto.ProductMinDTO;
import com.ifsuldeminas.escrud.dto.ProductRequestDTO;
import com.ifsuldeminas.escrud.dto.ProductResponseDTO;
import com.ifsuldeminas.escrud.entities.Category;
import com.ifsuldeminas.escrud.entities.Product;
import com.ifsuldeminas.escrud.entities.Supplier;
import com.ifsuldeminas.escrud.repositories.CategoryRepository;
import com.ifsuldeminas.escrud.repositories.ProductRepository;
import com.ifsuldeminas.escrud.repositories.SupplierRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @InjectMocks
    private ProductService service;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private SupplierRepository supplierRepository;

    private Product product;
    private Category category;
    private Supplier supplier;
    private ProductRequestDTO requestDTO;

    @BeforeEach
    void setUp() {
        category = new Category();
        category.setId(1);
        category.setName("Eletrônicos");

        supplier = new Supplier();
        supplier.setId(1L);
        supplier.setName("Samsung");

        product = new Product();
        product.setId(1L);
        product.setSku("SKU-123");
        product.setName("Smartphone");
        product.setDescription("Galaxy S23");
        product.setQuantityInStock(10);
        product.setMinStock(5);
        product.setCostPrice(new BigDecimal("2000.00"));
        product.setLocation("A1");
        product.setActive(true);
        product.setCategory(category);
        product.setDefaultSupplier(supplier);

        requestDTO = new ProductRequestDTO(
                "SKU-123",
                "Smartphone",
                "Galaxy S23",
                5,
                new BigDecimal("2000.00"),
                "A1",
                1,
                1L
        );
    }

    @Test
    @DisplayName("findAll deve aplicar filtro active=true por padrão se null for passado")
    void findAll_ShouldDefaultActiveTrue_WhenNull() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Product> page = new PageImpl<>(List.of(product));

        when(productRepository.search(null, null, true, pageable)).thenReturn(page);

        Page<ProductResponseDTO> result = service.findAll(pageable, null, null, null);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(productRepository).search(null, null, true, pageable);
    }

    @Test
    @DisplayName("findAllActiveList deve retornar lista de ProductMinDTO")
    void findAllActiveList_ShouldReturnList() {
        when(productRepository.findByActiveTrue()).thenReturn(List.of(product));

        List<ProductMinDTO> result = service.findAllActiveList();

        assertFalse(result.isEmpty());
        assertEquals("SKU-123", result.get(0).sku());
    }

    @Test
    @DisplayName("findById deve retornar DTO completo")
    void findById_ShouldReturnDTO() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        ProductResponseDTO result = service.findById(1L);

        assertEquals("Smartphone", result.name());
        assertEquals("Samsung", result.supplierName()); // Nome do método corrigido
    }

    @Test
    @DisplayName("findById deve lançar EntityNotFoundException se não encontrar")
    void findById_ShouldThrowException() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(EntityNotFoundException.class, () -> service.findById(99L));
    }

    @Test
    @DisplayName("create deve criar produto com estoque zero e ativo")
    void create_ShouldCreateProduct_WhenValid() {
        when(productRepository.existsBySku("SKU-123")).thenReturn(false);
        when(categoryRepository.findById(1)).thenReturn(Optional.of(category));
        when(supplierRepository.findById(1L)).thenReturn(Optional.of(supplier));
        when(productRepository.save(any(Product.class))).thenAnswer(i -> i.getArgument(0));

        ProductResponseDTO result = service.create(requestDTO);

        assertNotNull(result);
        assertTrue(result.active());
        assertEquals(0, result.quantityInStock());
        verify(productRepository).save(any(Product.class));
    }

    @Test
    @DisplayName("create deve lançar exceção se SKU já existe")
    void create_ShouldThrowException_WhenSkuExists() {
        when(productRepository.existsBySku("SKU-123")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> service.create(requestDTO));
        verify(productRepository, never()).save(any());
    }

    @Test
    @DisplayName("create deve permitir criar produto sem fornecedor (null)")
    void create_ShouldCreate_WhenSupplierIsNull() {
        ProductRequestDTO dtoSemFornecedor = new ProductRequestDTO(
                "SKU-NEW", "Novo", "Desc", 5, BigDecimal.TEN, "A1",
                1,
                null
        );

        when(productRepository.existsBySku("SKU-NEW")).thenReturn(false);
        when(categoryRepository.findById(1)).thenReturn(Optional.of(category));
        when(productRepository.save(any(Product.class))).thenAnswer(i -> i.getArgument(0));

        ProductResponseDTO result = service.create(dtoSemFornecedor);

        assertNull(result.supplierName());
        verify(supplierRepository, never()).findById(any());
    }

    @Test
    @DisplayName("update deve atualizar dados se SKU for válido")
    void update_ShouldUpdate_WhenSkuValid() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(categoryRepository.findById(1)).thenReturn(Optional.of(category));
        when(supplierRepository.findById(1L)).thenReturn(Optional.of(supplier));
        when(productRepository.save(any(Product.class))).thenAnswer(i -> i.getArgument(0));

        ProductResponseDTO result = service.update(1L, requestDTO);

        assertEquals("Smartphone", result.name());
        verify(productRepository, never()).existsBySku(any());
    }

    @Test
    @DisplayName("update deve lançar exceção se mudar SKU para um já existente")
    void update_ShouldThrowException_WhenSkuChangedAndExists() {
        ProductRequestDTO dtoNewSku = new ProductRequestDTO(
                "SKU-EXISTENTE", "X", "Y", 1, BigDecimal.TEN, "A",
                1,
                1L
        );

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.existsBySku("SKU-EXISTENTE")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> service.update(1L, dtoNewSku));
        verify(productRepository, never()).save(any());
    }

    @Test
    @DisplayName("delete deve inativar produto se estoque for zero")
    void delete_ShouldInactivate_WhenStockIsZero() {
        product.setQuantityInStock(0);
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        service.delete(1L);

        assertFalse(product.isActive());
        verify(productRepository).save(product);
    }

    @Test
    @DisplayName("delete deve lançar exceção se estoque for maior que zero")
    void delete_ShouldThrowException_WhenStockGreaterThanZero() {
        product.setQuantityInStock(5);
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> service.delete(1L));

        assertEquals("Cannot deactivate product with stock > 0", ex.getMessage());
        assertTrue(product.isActive());
        verify(productRepository, never()).save(any());
    }
}