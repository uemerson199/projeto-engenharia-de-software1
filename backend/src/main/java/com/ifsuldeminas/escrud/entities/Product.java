package com.ifsuldeminas.escrud.entities;

import jakarta.persistence.*;
import lombok.*;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, unique = true)
    private String sku;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(name = "quantity_in_stock", nullable = false)
    private int quantityInStock = 0;

    @Column(name = "minimum_stock", nullable = false)
    private int minimumStock = 0;

    @Column(name = "cost_price", nullable = false)
    private double costPrice;

    private String location;

    @Column(nullable = false)
    private boolean active = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "default_supplier_id")
    private Supplier defaultSupplier;

    @OneToMany(mappedBy = "product")
    @ToString.Exclude
    private Set<StockMovement> stockMovements;
}