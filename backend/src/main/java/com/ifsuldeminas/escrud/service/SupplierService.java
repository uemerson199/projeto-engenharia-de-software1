package com.ifsuldeminas.escrud.service;

import com.ifsuldeminas.escrud.dto.SupplierDTO;
import com.ifsuldeminas.escrud.entities.Supplier;
import com.ifsuldeminas.escrud.repositories.SupplierRepository;
import com.ifsuldeminas.escrud.service.exceptions.DatabaseException;
import com.ifsuldeminas.escrud.service.exceptions.ResourceNotFoundException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    @Transactional(readOnly = true)
    public SupplierDTO findById(Long id) {
        Supplier supplier = supplierRepository.findById((long) id.intValue()).orElseThrow(
                () -> new ResourceNotFoundException("Fornecedor não encontrado com o ID: " + id));
        return new SupplierDTO(supplier);
    }

    @Transactional(readOnly = true)
    public List<SupplierDTO> findAll() {
        List<Supplier> list = supplierRepository.findAll();
        return list.stream().map(SupplierDTO::new).collect(Collectors.toList());
    }

    @Transactional
    public SupplierDTO insert(SupplierDTO dto) {
        Supplier entity = new Supplier();
        copyDtoToEntity(dto, entity);
        if (dto.getActive() != null) {
            entity.setActive(dto.getActive());
        }
        entity = supplierRepository.save(entity);
        return new SupplierDTO(entity);
    }

    @Transactional
    public SupplierDTO update(Long id, SupplierDTO dto) {
        try {
            // Conversão de Long para int
            Supplier entity = supplierRepository.getReferenceById((long) id.intValue());
            copyDtoToEntity(dto, entity);
            if (dto.getActive() != null) {
                entity.setActive(dto.getActive());
            }
            entity = supplierRepository.save(entity);
            return new SupplierDTO(entity);
        } catch (EntityNotFoundException e) {
            throw new ResourceNotFoundException("Recurso não encontrado com o ID: " + id);
        }
    }

    public void delete(Long id) {
        if (!supplierRepository.existsById((long) id.intValue())) {
            throw new ResourceNotFoundException("Recurso não encontrado com o ID: " + id);
        }
        try {
            supplierRepository.deleteById((long) id.intValue());
        }
        catch (DataIntegrityViolationException e) {
            throw new DatabaseException("Violação de integridade: este fornecedor não pode ser excluído.");
        }
    }

    private void copyDtoToEntity(SupplierDTO dto, Supplier entity) {
        entity.setName(dto.getName());
        entity.setContactInfo(dto.getContactInfo());
    }
}