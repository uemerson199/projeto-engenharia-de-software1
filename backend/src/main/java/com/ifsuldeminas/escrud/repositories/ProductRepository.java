package com.ifsuldeminas.escrud.repositories;
import com.ifsuldeminas.escrud.dto.LowStockItemDTO;
import com.ifsuldeminas.escrud.entities.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT p FROM Product p WHERE " +
            "(:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " + "(:sku IS NULL OR LOWER(p.sku) LIKE LOWER(CONCAT('%', :sku, '%'))) AND " + "(:active IS NULL OR p.active = :active)")
    Page<Product> search(@Param("name") String name,
                         @Param("sku") String sku,
                         @Param("active") Boolean active,
                         Pageable pageable);
    boolean existsBySku(String sku);
    List<Product> findByActiveTrue();

    @Query("SELECT SUM(p.costPrice * p.quantityInStock) FROM Product p WHERE p.active = true")
    BigDecimal getTotalStockValue();

    @Query("SELECT new com.ifsuldeminas.escrud.dto.LowStockItemDTO(p.id, p.sku, p.name, p.quantityInStock, p.minStock) " +
            "FROM Product p WHERE p.active = true AND p.quantityInStock <= p.minStock")
    List<LowStockItemDTO> findLowStockItems();

}