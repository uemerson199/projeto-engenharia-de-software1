package com.ifsuldeminas.escrud.controllers;
import com.ifsuldeminas.escrud.dto.SupplierRequestDTO;
import com.ifsuldeminas.escrud.dto.SupplierResponseDTO;
import com.ifsuldeminas.escrud.service.SupplierService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
@RequiredArgsConstructor
public class SupplierController {
    private final SupplierService service;
    @GetMapping
    public ResponseEntity<Page<SupplierResponseDTO>> findAll(
            @PageableDefault(size = 20, sort = "name") Pageable pageable,
            @RequestParam(required = false) String name) {
        return ResponseEntity.ok(service.findAll(pageable, name));
    }
    @GetMapping("/active")
    public ResponseEntity<List<SupplierResponseDTO>> findAllActive() {
        return ResponseEntity.ok(service.findAllActive());
    }
    @GetMapping("/{id}")
    public ResponseEntity<SupplierResponseDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }
    @PostMapping
    public ResponseEntity<SupplierResponseDTO> create(@RequestBody
                                                      SupplierRequestDTO dto) {
        SupplierResponseDTO saved = service.create(dto);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(saved.id())
                .toUri();
        return ResponseEntity.created(uri).body(saved);
    }
    @PutMapping("/{id}")
    public ResponseEntity<SupplierResponseDTO> update(@PathVariable Long id,
                                                      @RequestBody SupplierRequestDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}