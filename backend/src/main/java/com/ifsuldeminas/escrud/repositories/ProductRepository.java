package com.ifsuldeminas.escrud.repositories;

import com.ifsuldeminas.escrud.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
