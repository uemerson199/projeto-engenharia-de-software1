package com.ifsuldeminas.escrud.service;
import com.ifsuldeminas.escrud.dto.SupplierRequestDTO;
import com.ifsuldeminas.escrud.dto.SupplierResponseDTO;
import com.ifsuldeminas.escrud.entities.Supplier;
import com.ifsuldeminas.escrud.repositories.SupplierRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
@RequiredArgsConstructor
public class SupplierService {
    private final SupplierRepository repository;
    public Page<SupplierResponseDTO> findAll(Pageable pageable, String name) {
        Page<Supplier> page;
        if (name != null && !name.isBlank()) {
            page = repository.findByNameContainingIgnoreCase(name, pageable);
        } else {
            page = repository.findAll(pageable);
        }
        return page.map(this::mapToDTO);
    }
    public List<SupplierResponseDTO> findAllActive() {
        return repository.findByActiveTrue().stream()
                .map(this::mapToDTO)
                .toList();
    }
    public SupplierResponseDTO findById(Long id) {
        Supplier entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Supplier not found with id: " +
                        id));
        return mapToDTO(entity);
    }
    public SupplierResponseDTO create(SupplierRequestDTO dto) {
// Validação simples de nome único
        if (repository.existsByName(dto.name())) {
            throw new IllegalArgumentException("Supplier name already exists");
        }
        Supplier entity = new Supplier();
        entity.setName(dto.name());
        entity.setContactInfo(dto.contactInfo());
        entity.setActive(true);
        return mapToDTO(repository.save(entity));
    }
    public SupplierResponseDTO update(Long id, SupplierRequestDTO dto) {
        Supplier entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Supplier not found"));
        if (!entity.getName().equalsIgnoreCase(dto.name()) &&
                repository.existsByName(dto.name())) {
            throw new IllegalArgumentException("Supplier name already exists");
        }
        entity.setName(dto.name());
        entity.setContactInfo(dto.contactInfo());
        return mapToDTO(repository.save(entity));
    }
    public void delete(Long id) {
        Supplier entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Supplier not found"));
        entity.setActive(false);
        repository.save(entity);
    }
    private SupplierResponseDTO mapToDTO(Supplier entity) {
        return new SupplierResponseDTO(
                entity.getId(),
                entity.getName(),
                entity.getContactInfo(),
                entity.isActive()
        );
    }
}
