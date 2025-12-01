package com.ifsuldeminas.escrud.repositories;
import com.ifsuldeminas.escrud.entities.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
public interface ProductRepository extends JpaRepository<Product, Long> {
// Query inteligente: Se o parametro for nulo, ele ignora o filtro
    @Query("SELECT p FROM Product p WHERE " +
            "(:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " + "(:sku IS NULL OR LOWER(p.sku) LIKE LOWER(CONCAT('%', :sku, '%'))) AND " + "(:active IS NULL OR p.active = :active)")
    Page<Product> search(@Param("name") String name,
                         @Param("sku") String sku,
                         @Param("active") Boolean active,
                         Pageable pageable);
    boolean existsBySku(String sku);
    List<Product> findByActiveTrue();
}