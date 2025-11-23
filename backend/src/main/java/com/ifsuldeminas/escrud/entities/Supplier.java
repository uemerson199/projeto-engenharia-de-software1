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
@Table(name = "suppliers")
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "contact_info")
    private String contactInfo;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

    @OneToMany(mappedBy = "defaultSupplier")
    @ToString.Exclude
    private Set<Product> defaultProducts;

    @OneToMany(mappedBy = "supplier")
    @ToString.Exclude
    private Set<StockMovement> stockMovements;
}