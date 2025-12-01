package com.ifsuldeminas.escrud.entities;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
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
    private Long id;
    @Column(nullable = false, unique = true)
    private String sku;
    @Column(nullable = false)
    private String name;
    private String description;
    @Column(name = "quantity_in_stock", nullable = false)
    private int quantityInStock = 0;
    @Column(name = "min_stock", nullable = false)
    private int minStock;
    @Column(name = "cost_price", nullable = false)
    private BigDecimal costPrice;
    private String location;
    @Column(nullable = false)
    private boolean active = true;
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
    @ManyToOne
    @JoinColumn(name = "default_supplier_id")
    private Supplier defaultSupplier;
}