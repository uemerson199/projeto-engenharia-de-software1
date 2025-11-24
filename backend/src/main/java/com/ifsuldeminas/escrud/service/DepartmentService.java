package com.ifsuldeminas.escrud.service;
import com.ifsuldeminas.escrud.dto.DepartmentRequestDTO;
import com.ifsuldeminas.escrud.dto.DepartmentResponseDTO;
import com.ifsuldeminas.escrud.entities.Department;
import com.ifsuldeminas.escrud.repositories.DepartmentRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
@RequiredArgsConstructor
public class DepartmentService {
    private final DepartmentRepository repository;
    public Page<DepartmentResponseDTO> findAll(Pageable pageable, String name) {
        Page<Department> page;
        if (name != null && !name.isBlank()) {
            page = repository.findByNameContainingIgnoreCase(name, pageable);
        } else {
            page = repository.findAll(pageable);
        }
        return page.map(this::mapToDTO);
    }
    public List<DepartmentResponseDTO> findAllActive() {
        return repository.findByActiveTrue().stream()
                .map(this::mapToDTO)
                .toList();
    }
    public DepartmentResponseDTO findById(Integer id) {
        Department entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Department not found with id: "
                        + id));
        return mapToDTO(entity);
    }
    public DepartmentResponseDTO create(DepartmentRequestDTO dto) {
        if (repository.existsByName(dto.name())) {
            throw new IllegalArgumentException("Department name already exists");
        }
        Department entity = new Department();
        entity.setName(dto.name());
        entity.setActive(true);
        return mapToDTO(repository.save(entity));
    }
    public DepartmentResponseDTO update(Integer id, DepartmentRequestDTO dto) {
        Department entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Department not found"));
        if (!entity.getName().equalsIgnoreCase(dto.name()) &&
                repository.existsByName(dto.name())) {
            throw new IllegalArgumentException("Department name already exists");
        }
        entity.setName(dto.name());
        return mapToDTO(repository.save(entity));
    }
    public void delete(Integer id) {
        Department entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Department not found"));
        entity.setActive(false);
        repository.save(entity);
    }
    private DepartmentResponseDTO mapToDTO(Department entity) {
        return new DepartmentResponseDTO(entity.getId(), entity.getName(), entity.isActive());
    }
}
