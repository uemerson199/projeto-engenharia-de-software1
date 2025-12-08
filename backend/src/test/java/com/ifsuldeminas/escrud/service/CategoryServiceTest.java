package com.ifsuldeminas.escrud.service;

import com.ifsuldeminas.escrud.dto.CategoryRequestDTO;
import com.ifsuldeminas.escrud.dto.CategoryResponseDTO;
import com.ifsuldeminas.escrud.entities.Category;
import com.ifsuldeminas.escrud.repositories.CategoryRepository;
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
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @InjectMocks
    private CategoryService service;

    @Mock
    private CategoryRepository repository;

    private Category category;
    private CategoryRequestDTO requestDTO;

    @BeforeEach
    void setUp() {
        category = new Category();
        category.setId(1);
        category.setName("Eletrônicos");
        category.setActive(true);

        requestDTO = new CategoryRequestDTO("Eletrônicos");
    }

    @Test
    @DisplayName("findAll deve retornar página de categorias quando nenhum nome é informado")
    void findAll_ShouldReturnPage_WhenNameIsNull() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Category> page = new PageImpl<>(List.of(category));

        when(repository.findAll(pageable)).thenReturn(page);

        Page<CategoryResponseDTO> result = service.findAll(pageable, null);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("Eletrônicos", result.getContent().get(0).name());
        verify(repository, times(1)).findAll(pageable);
    }

    @Test
    @DisplayName("findAll deve filtrar por nome quando nome é informado")
    void findAll_ShouldFilterByName_WhenNameIsProvided() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Category> page = new PageImpl<>(List.of(category));
        String filterName = "Ele";

        when(repository.findByNameContainingIgnoreCase(filterName, pageable)).thenReturn(page);

        Page<CategoryResponseDTO> result = service.findAll(pageable, filterName);

        assertNotNull(result);
        verify(repository, times(1)).findByNameContainingIgnoreCase(filterName, pageable);
        verify(repository, never()).findAll(pageable);
    }

    @Test
    @DisplayName("findById deve retornar DTO quando ID existe")
    void findById_ShouldReturnDTO_WhenIdExists() {
        when(repository.findById(1)).thenReturn(Optional.of(category));

        CategoryResponseDTO result = service.findById(1);

        assertNotNull(result);
        assertEquals(category.getId(), result.id());
    }

    @Test
    @DisplayName("findById deve lançar EntityNotFoundException quando ID não existe")
    void findById_ShouldThrowException_WhenIdDoesNotExist() {
        when(repository.findById(99)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> service.findById(99));
    }


    @Test
    @DisplayName("create deve salvar categoria quando nome é único")
    void create_ShouldSaveCategory_WhenNameIsUnique() {
        when(repository.existsByName(requestDTO.name())).thenReturn(false);
        when(repository.save(any(Category.class))).thenReturn(category);

        CategoryResponseDTO result = service.create(requestDTO);

        assertNotNull(result);
        assertEquals(category.getName(), result.name());
        verify(repository, times(1)).save(any(Category.class));
    }

    @Test
    @DisplayName("create deve lançar IllegalArgumentException quando nome já existe")
    void create_ShouldThrowException_WhenNameAlreadyExists() {
        when(repository.existsByName(requestDTO.name())).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> service.create(requestDTO));
        verify(repository, never()).save(any());
    }


    @Test
    @DisplayName("update deve atualizar categoria com sucesso")
    void update_ShouldUpdateCategory_WhenValid() {
        CategoryRequestDTO updateDTO = new CategoryRequestDTO("Novos Eletrônicos");

        when(repository.findById(1)).thenReturn(Optional.of(category));
        when(repository.existsByName("Novos Eletrônicos")).thenReturn(false);
        when(repository.save(any(Category.class))).thenAnswer(invocation -> invocation.getArgument(0));

        CategoryResponseDTO result = service.update(1, updateDTO);

        assertEquals("Novos Eletrônicos", result.name());
    }

    @Test
    @DisplayName("update deve lançar exceção se tentar usar nome duplicado")
    void update_ShouldThrowException_WhenNameDuplicated() {
        CategoryRequestDTO updateDTO = new CategoryRequestDTO("Moveis");

        when(repository.findById(1)).thenReturn(Optional.of(category));
        when(repository.existsByName("Moveis")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> service.update(1, updateDTO));
        verify(repository, never()).save(any());
    }

    @Test
    @DisplayName("update não deve validar duplicidade se o nome for o mesmo")
    void update_ShouldNotThrowException_WhenNameIsSame() {
        CategoryRequestDTO sameNameDTO = new CategoryRequestDTO("Eletrônicos");

        when(repository.findById(1)).thenReturn(Optional.of(category));
        when(repository.save(any(Category.class))).thenReturn(category);

        service.update(1, sameNameDTO);

        verify(repository, never()).existsByName(anyString());
        verify(repository, times(1)).save(any());
    }

    @Test
    @DisplayName("delete deve realizar Soft Delete (set Active false)")
    void delete_ShouldSoftDelete_WhenIdExists() {
        when(repository.findById(1)).thenReturn(Optional.of(category));

        service.delete(1);

        assertFalse(category.isActive());
        verify(repository, times(1)).save(category);
    }

    @Test
    @DisplayName("delete deve lançar exceção quando ID não existe")
    void delete_ShouldThrowException_WhenIdDoesNotExist() {
        when(repository.findById(99)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> service.delete(99));
    }
}