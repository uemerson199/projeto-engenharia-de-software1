package com.ifsuldeminas.escrud.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tb_suplier")
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String contactName;
    private String phone;
    @Column(unique = true)
    private String email;
    @Column(unique = true)
    private String cnpj;

    @OneToMany(mappedBy = "supplier")
    private List<Product> products = new ArrayList<>();


}
