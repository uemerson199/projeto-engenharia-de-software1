package com.ifsuldeminas.escrud.dto;


import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class SupplierDTO {

    private Long id;
    private String name;
    private String contactName;
    private String phone;
    private String email;
    private String cnpj;

}
