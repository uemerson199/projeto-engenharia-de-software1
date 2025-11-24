package com.ifsuldeminas.escrud.repositories;
import com.ifsuldeminas.escrud.entities.Department;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface DepartmentRepository extends JpaRepository<Department, Integer> {
    Page<Department> findByNameContainingIgnoreCase(String name, Pageable pageable);
    boolean existsByName(String name);
    List<Department> findByActiveTrue();
}