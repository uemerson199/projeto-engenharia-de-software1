package com.ifsuldeminas.escrud.repositories;

import com.ifsuldeminas.escrud.entities.MovementType;
import com.ifsuldeminas.escrud.entities.StockMovement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {

    @Query("SELECT m FROM StockMovement m WHERE " +
            "(:productId IS NULL OR m.product.id = :productId) AND " +
            "(:departmentId IS NULL OR m.department.id = :departmentId) AND " +
            "(:type IS NULL OR m.type = :type) AND " +
            "(cast(:startDate as date) IS NULL OR m.dateTime >= :startDate) AND " +
            "(cast(:endDate as date) IS NULL OR m.dateTime <= :endDate)")
    Page<StockMovement> search(
            @Param("productId") Long productId,
            @Param("departmentId") Integer departmentId,
            @Param("type") MovementType type,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable);

    Page<StockMovement> findByProductId(Long productId, Pageable pageable);
}