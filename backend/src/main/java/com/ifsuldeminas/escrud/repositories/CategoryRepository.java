package com.ifsuldeminas.escrud.repositories;
import com.ifsuldeminas.escrud.entities.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    // Busca por nome (parcial e ignorando case) para filtros
    Page<Category> findByNameContainingIgnoreCase(String name, Pageable pageable);
    // Verifica se já existe nome (para validação)
    boolean existsByName(String name);
    // Busca apenas ativos (para listas de seleção)
    List<Category> findByActiveTrue();
}