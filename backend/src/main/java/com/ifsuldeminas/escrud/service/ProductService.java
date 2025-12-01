package com.ifsuldeminas.escrud.service;
import com.ifsuldeminas.escrud.dto.ProductMinDTO;
import com.ifsuldeminas.escrud.dto.ProductRequestDTO;
import com.ifsuldeminas.escrud.dto.ProductResponseDTO;
import com.ifsuldeminas.escrud.entities.Category;
import com.ifsuldeminas.escrud.entities.Product;
import com.ifsuldeminas.escrud.entities.Supplier;
import com.ifsuldeminas.escrud.repositories.CategoryRepository;
import com.ifsuldeminas.escrud.repositories.ProductRepository;
import com.ifsuldeminas.escrud.repositories.SupplierRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    public Page<ProductResponseDTO> findAll(Pageable pageable, String name, String sku,
                                            Boolean active) {
// Se active não for passado na URL, assume true (conforme doc)
        Boolean activeFilter = (active != null) ? active : true;
        return productRepository.search(name, sku, activeFilter, pageable)
                .map(this::mapToDTO);
    }
    public List<ProductMinDTO> findAllActiveList() {
        return productRepository.findByActiveTrue().stream()
                .map(p -> new ProductMinDTO(p.getId(), p.getSku(), p.getName()))
                .toList();
    }
    public ProductResponseDTO findById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));
        return mapToDTO(product);
    }
    public ProductResponseDTO create(ProductRequestDTO dto) {
        if (productRepository.existsBySku(dto.sku())) {
            throw new IllegalArgumentException("SKU already exists");
        }
        Product product = new Product();
        updateProductData(product, dto);
// Regra de negócio: Estoque inicial é sempre 0
        product.setQuantityInStock(0);
        product.setActive(true);
        return mapToDTO(productRepository.save(product));
    }
    public ProductResponseDTO update(Long id, ProductRequestDTO dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));
// Se mudou o SKU, verificar unicidade
        if (!product.getSku().equalsIgnoreCase(dto.sku()) &&
                productRepository.existsBySku(dto.sku())) {
            throw new IllegalArgumentException("SKU already exists");
        }
        updateProductData(product, dto);
        return mapToDTO(productRepository.save(product));
    }
    public void delete(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));
// Regra de negócio: Não inativar se tiver estoque
        if (product.getQuantityInStock() > 0) {
            throw new IllegalArgumentException("Cannot deactivate product with stock > 0");
        }
        product.setActive(false);
        productRepository.save(product);
    }
    // Método auxiliar para converter RequestDTO em Entidade
    private void updateProductData(Product entity, ProductRequestDTO dto) {
        entity.setSku(dto.sku());
        entity.setName(dto.name());
        entity.setDescription(dto.description());
        entity.setMinStock(dto.minStock());
        entity.setCostPrice(dto.costPrice());
        entity.setLocation(dto.location());
// Buscar Categoria
        Category category = categoryRepository.findById(dto.categoryId())
                .orElseThrow(() -> new EntityNotFoundException("Category not found"));
        entity.setCategory(category);
// Buscar Fornecedor (Opcional)
        if (dto.defaultSupplierId() != null) {
            Supplier supplier = supplierRepository.findById(dto.defaultSupplierId())
                    .orElseThrow(() -> new EntityNotFoundException("Supplier not found"));
            entity.setDefaultSupplier(supplier);
        } else {
            entity.setDefaultSupplier(null);
        }
    }
    private ProductResponseDTO mapToDTO(Product entity) {
        return new ProductResponseDTO(
                entity.getId(),
                entity.getSku(),
                entity.getName(),
                entity.getDescription(),
                entity.getQuantityInStock(),
                entity.getMinStock(),
                entity.getCostPrice(),
                entity.getLocation(),
                entity.isActive(),
                entity.getCategory().getName(),
                entity.getDefaultSupplier() != null ? entity.getDefaultSupplier().getName() : null
        );
    }
}
