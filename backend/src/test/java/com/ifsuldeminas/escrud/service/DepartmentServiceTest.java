package com.ifsuldeminas.escrud.service;

import com.ifsuldeminas.escrud.dto.DepartmentRequestDTO;
import com.ifsuldeminas.escrud.dto.DepartmentResponseDTO;
import com.ifsuldeminas.escrud.entities.Department;
import com.ifsuldeminas.escrud.repositories.DepartmentRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DepartmentServiceTest {

    @InjectMocks
    private DepartmentService service;

    @Mock
    private DepartmentRepository repository;

    private Department department;
    private DepartmentRequestDTO requestDTO;

    @BeforeEach
    void setUp() {
        department = new Department();
        department.setId(1);
        department.setName("Tecnologia da Informação");
        department.setActive(true);

        requestDTO = new DepartmentRequestDTO("Tecnologia da Informação");
    }


    @Test
    @DisplayName("findAll deve retornar todos quando filtro de nome é nulo")
    void findAll_ShouldReturnAll_WhenNameIsNull() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Department> page = new PageImpl<>(List.of(department));

        when(repository.findAll(pageable)).thenReturn(page);

        Page<DepartmentResponseDTO> result = service.findAll(pageable, null);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(repository).findAll(pageable);
    }

    @Test
    @DisplayName("findAll deve filtrar por nome quando fornecido")
    void findAll_ShouldFilter_WhenNameIsProvided() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Department> page = new PageImpl<>(List.of(department));
        String nomeFiltro = "Tecnologia";

        when(repository.findByNameContainingIgnoreCase(nomeFiltro, pageable)).thenReturn(page);

        Page<DepartmentResponseDTO> result = service.findAll(pageable, nomeFiltro);

        assertEquals(1, result.getTotalElements());
        verify(repository).findByNameContainingIgnoreCase(nomeFiltro, pageable);
    }

    @Test
    @DisplayName("findAllActive deve retornar apenas ativos")
    void findAllActive_ShouldReturnActiveDepartments() {
        when(repository.findByActiveTrue()).thenReturn(List.of(department));

        List<DepartmentResponseDTO> result = service.findAllActive();

        assertFalse(result.isEmpty());
        assertEquals("Tecnologia da Informação", result.get(0).name());
        verify(repository).findByActiveTrue();
    }

    @Test
    @DisplayName("findById deve retornar DTO se existir")
    void findById_ShouldReturnDTO_WhenIdExists() {
        when(repository.findById(1)).thenReturn(Optional.of(department));

        DepartmentResponseDTO result = service.findById(1);

        assertEquals(department.getName(), result.name());
    }

    @Test
    @DisplayName("findById deve lançar Exception se não existir")
    void findById_ShouldThrowException_WhenIdNotFound() {
        when(repository.findById(99)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> service.findById(99));
    }

    @Test
    @DisplayName("create deve salvar departamento se nome for único")
    void create_ShouldSave_WhenNameIsUnique() {
        when(repository.existsByName(requestDTO.name())).thenReturn(false);
        when(repository.save(any(Department.class))).thenReturn(department);

        DepartmentResponseDTO result = service.create(requestDTO);

        assertNotNull(result);
        assertTrue(result.active());
        verify(repository).save(any(Department.class));
    }

    @Test
    @DisplayName("create deve lançar Exception se nome duplicado")
    void create_ShouldThrowException_WhenNameExists() {
        when(repository.existsByName(requestDTO.name())).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> service.create(requestDTO));
        verify(repository, never()).save(any());
    }

    @Test
    @DisplayName("update deve atualizar nome com sucesso")
    void update_ShouldUpdate_WhenValid() {
        DepartmentRequestDTO novoNomeDTO = new DepartmentRequestDTO("Recursos Humanos");

        when(repository.findById(1)).thenReturn(Optional.of(department));
        when(repository.existsByName("Recursos Humanos")).thenReturn(false);
        when(repository.save(any(Department.class))).thenAnswer(i -> i.getArgument(0));

        DepartmentResponseDTO result = service.update(1, novoNomeDTO);

        assertEquals("Recursos Humanos", result.name());
    }

    @Test
    @DisplayName("update não deve validar duplicidade se o nome não mudou")
    void update_ShouldNotCheckDuplicate_WhenNameIsSame() {
        when(repository.findById(1)).thenReturn(Optional.of(department));
        when(repository.save(any(Department.class))).thenReturn(department);

        service.update(1, requestDTO);

        verify(repository, never()).existsByName(anyString());
        verify(repository).save(any());
    }

    @Test
    @DisplayName("update deve lançar Exception se nome duplicado for diferente do atual")
    void update_ShouldThrowException_WhenNameChangedAndExists() {
        DepartmentRequestDTO novoNomeDTO = new DepartmentRequestDTO("Financeiro");

        when(repository.findById(1)).thenReturn(Optional.of(department));
        when(repository.existsByName("Financeiro")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> service.update(1, novoNomeDTO));
    }

    @Test
    @DisplayName("delete deve realizar soft delete")
    void delete_ShouldSoftDelete_WhenIdExists() {
        when(repository.findById(1)).thenReturn(Optional.of(department));

        service.delete(1);

        assertFalse(department.isActive());
        verify(repository).save(department);
    }

    @Test
    @DisplayName("delete deve lançar Exception se ID não existir")
    void delete_ShouldThrowException_WhenIdNotFound() {
        when(repository.findById(99)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> service.delete(99));
    }
}