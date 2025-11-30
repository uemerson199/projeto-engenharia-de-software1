package com.ifsuldeminas.escrud.controllers;
import com.ifsuldeminas.escrud.dto.DepartmentRequestDTO;
import com.ifsuldeminas.escrud.dto.DepartmentResponseDTO;
import com.ifsuldeminas.escrud.service.DepartmentService;
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
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentController {
    private final DepartmentService service;
    @GetMapping
    public ResponseEntity<Page<DepartmentResponseDTO>> findAll(
            @PageableDefault(size = 20, sort = "name") Pageable pageable,
            @RequestParam(required = false) String name) {
        return ResponseEntity.ok(service.findAll(pageable, name));
    }
    @GetMapping("/active")
    public ResponseEntity<List<DepartmentResponseDTO>> findAllActive() {
        return ResponseEntity.ok(service.findAllActive());
    }
    @GetMapping("/{id}")
    public ResponseEntity<DepartmentResponseDTO> findById(@PathVariable Integer id) {
        return ResponseEntity.ok(service.findById(id));
    }
    @PostMapping
    public ResponseEntity<DepartmentResponseDTO> create(@RequestBody
                                                        DepartmentRequestDTO dto) {
        DepartmentResponseDTO saved = service.create(dto);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(saved.id())
                .toUri();
        return ResponseEntity.created(uri).body(saved);
    }
    @PutMapping("/{id}")
    public ResponseEntity<DepartmentResponseDTO> update(@PathVariable Integer id,
                                                        @RequestBody DepartmentRequestDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
