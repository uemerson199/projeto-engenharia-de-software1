package com.ifsuldeminas.escrud.service;

import com.ifsuldeminas.escrud.dto.StockMovementRequestDTO;
import com.ifsuldeminas.escrud.dto.StockMovementResponseDTO;
import com.ifsuldeminas.escrud.entities.*;
import com.ifsuldeminas.escrud.entities.MovementType;
import com.ifsuldeminas.escrud.repositories.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class StockMovementService {

    private final StockMovementRepository movementRepository;
    private final ProductRepository productRepository;
    private final DepartmentRepository departmentRepository;
    private final SupplierRepository supplierRepository;
    private final UserRepository userRepository;

    @Transactional
    public StockMovementResponseDTO create(StockMovementRequestDTO dto) {
        Product product = productRepository.findById(dto.productId())
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        if (dto.type() == MovementType.ENTRADA_COMPRA && dto.supplierId() == null) {
            throw new IllegalArgumentException("Supplier is required for Purchase Entry");
        }
        if ((dto.type() == MovementType.SAIDA_REQUISICAO || dto.type() == MovementType.DEVOLUCAO) && dto.departmentId() == null) {
            throw new IllegalArgumentException("Department is required for Requisition/Return");
        }
        if (dto.type() == MovementType.AJUSTE && (dto.reason() == null || dto.reason().isBlank())) {
            throw new IllegalArgumentException("Reason is required for Adjustment");
        }

        if (dto.quantity() < 0 && (product.getQuantityInStock() + dto.quantity() < 0)) {
            throw new IllegalArgumentException("Insufficient stock for this operation.");
        }

        product.setQuantityInStock(product.getQuantityInStock() + dto.quantity());
        productRepository.save(product);

        StockMovement movement = new StockMovement();
        movement.setDateTime(LocalDateTime.now());
        movement.setType(dto.type());
        movement.setQuantity(dto.quantity());
        movement.setReason(dto.reason());
        movement.setProduct(product);

        if (dto.departmentId() != null) {
            movement.setDepartment(departmentRepository.findById(dto.departmentId())
                    .orElseThrow(() -> new EntityNotFoundException("Department not found")));
        }

        if (dto.supplierId() != null) {
            movement.setSupplier(supplierRepository.findById(dto.supplierId())
                    .orElseThrow(() -> new EntityNotFoundException("Supplier not found")));
        }

        String login = SecurityContextHolder.getContext().getAuthentication().getName();
        userRepository.findByLogin(login).ifPresent(movement::setUser);

        return mapToDTO(movementRepository.save(movement));
    }

    public Page<StockMovementResponseDTO> findAll(Pageable pageable, Long productId, Integer deptId, MovementType type, LocalDate start, LocalDate end) {
        LocalDateTime startDt = (start != null) ? start.atStartOfDay() : null;
        LocalDateTime endDt = (end != null) ? end.atTime(23, 59, 59) : null;

        return movementRepository.search(productId, deptId, type, startDt, endDt, pageable)
                .map(this::mapToDTO);
    }

    public Page<StockMovementResponseDTO> findByProduct(Long productId, Pageable pageable) {
        if (!productRepository.existsById(productId)) {
            throw new EntityNotFoundException("Product not found");
        }
        return movementRepository.findByProductId(productId, pageable)
                .map(this::mapToDTO);
    }

    private StockMovementResponseDTO mapToDTO(StockMovement entity) {
        return new StockMovementResponseDTO(
                entity.getId(),
                entity.getDateTime(),
                entity.getType(),
                entity.getQuantity(),
                entity.getReason(),
                entity.getProduct().getName(),
                entity.getDepartment() != null ? entity.getDepartment().getName() : null,
                entity.getSupplier() != null ? entity.getSupplier().getName() : null,
                entity.getUser() != null ? entity.getUser().getName() : "Unknown"
        );
    }
}