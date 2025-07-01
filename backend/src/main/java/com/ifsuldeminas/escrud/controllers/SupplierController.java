package com.ifsuldeminas.escrud.controllers;

import com.ifsuldeminas.escrud.dto.SupplierDTO;
import com.ifsuldeminas.escrud.service.SupplierService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping(value = "/api/suppliers")
public class SupplierController {

    private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<SupplierDTO> findById(@PathVariable Long id) {
        SupplierDTO dto = supplierService.findById(id);
        return ResponseEntity.ok(dto);
    }


    @GetMapping
    public ResponseEntity<List<SupplierDTO>> findAll() {
        List<SupplierDTO> list = supplierService.findAll();
        return ResponseEntity.ok(list);
    }

    @PostMapping
    public ResponseEntity<SupplierDTO> insert(@RequestBody SupplierDTO dto) {
        dto = supplierService.insert(dto);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(dto.getId()).toUri();
        return ResponseEntity.created(uri).body(dto);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<SupplierDTO> update(@PathVariable Long id, @RequestBody SupplierDTO dto) {
        dto = supplierService.update(id, dto);
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        supplierService.delete(id);
        return ResponseEntity.noContent().build();
    }
}