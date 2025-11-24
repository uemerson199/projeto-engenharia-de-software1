package com.ifsuldeminas.escrud.service;
import com.ifsuldeminas.escrud.dto.CategoryRequestDTO;
import com.ifsuldeminas.escrud.dto.CategoryResponseDTO;
import com.ifsuldeminas.escrud.entities.Category;
import com.ifsuldeminas.escrud.repositories.CategoryRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository repository;
    // Listar todos (paginado)
    public Page<CategoryResponseDTO> findAll(Pageable pageable, String name) {
        Page<Category> page;
        if (name != null && !name.isBlank()) {
            page = repository.findByNameContainingIgnoreCase(name, pageable);
        } else {
            page = repository.findAll(pageable);
        }
        return page.map(this::mapToDTO);
    }
    // Listar ativos (para combobox)
    public List<CategoryResponseDTO> findAllActive() {
        return repository.findByActiveTrue().stream()
                .map(this::mapToDTO)
                .toList();
    }
    public CategoryResponseDTO findById(int id) {
        Category category = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " +
                        id));
        return mapToDTO(category);
    }
    public CategoryResponseDTO create(CategoryRequestDTO dto) {
        if (repository.existsByName(dto.name())) {
            throw new IllegalArgumentException("Category name already exists");
        }
        Category entity = new Category();
        entity.setName(dto.name());
        entity.setActive(true); // Padrão
        return mapToDTO(repository.save(entity));
    }
    public CategoryResponseDTO update(int id, CategoryRequestDTO dto) {
        Category entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Category not found"));
// Se mudou o nome, verifica se já existe
        if (!entity.getName().equalsIgnoreCase(dto.name()) &&
                repository.existsByName(dto.name())) {
            throw new IllegalArgumentException("Category name already exists");
        }
        entity.setName(dto.name());
        return mapToDTO(repository.save(entity));
    }
    // Exclusão Lógica (Soft Delete)
    public void delete(int id) {
        Category entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Category not found"));
        entity.setActive(false);
        repository.save(entity);
    }
    private CategoryResponseDTO mapToDTO(Category entity) {
        return new CategoryResponseDTO(entity.getId(), entity.getName(), entity.isActive());
    }
}