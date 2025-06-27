package com.ifsuldeminas.escrud.service;

import com.ifsuldeminas.escrud.dto.SupplierDTO;
import com.ifsuldeminas.escrud.entities.Supplier;
import com.ifsuldeminas.escrud.repositories.SupplierRepository;
import com.ifsuldeminas.escrud.service.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    public SupplierDTO findById(Long id) {
        Supplier supplier = supplierRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Recurso não encontrado"));
        return new SupplierDTO(supplier);
    }


}
