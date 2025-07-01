package com.ifsuldeminas.escrud.dto;

import com.ifsuldeminas.escrud.entities.Supplier;

public class SupplierDTO {

    private Long id;
    private String name;
    private String contactName;
    private String phone;
    private String email;
    private String cnpj;

    public SupplierDTO(Long id, String name, String contactName, String phone, String email, String cnpj) {
        this.id = id;
        this.name = name;
        this.contactName = contactName;
        this.phone = phone;
        this.email = email;
        this.cnpj = cnpj;
    }

    public SupplierDTO() {

    }

    public SupplierDTO(Supplier supplier) {
        this.id = supplier.getId();
        this.name = supplier.getName();
        this.contactName = supplier.getContactName();
        this.phone = supplier.getPhone();
        this.email = supplier.getEmail();
        this.cnpj = supplier.getCnpj();
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getContactName() {
        return contactName;
    }

    public void setContactName(String contactName) {
        this.contactName = contactName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCnpj() {
        return cnpj;
    }

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }
}