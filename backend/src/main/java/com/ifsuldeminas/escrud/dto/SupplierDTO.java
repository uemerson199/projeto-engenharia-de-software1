package com.ifsuldeminas.escrud.dto;

import com.ifsuldeminas.escrud.entities.Supplier;

public class SupplierDTO {

    private Long id;
    private String name;
    private String contactInfo;
    private Boolean active;

    public SupplierDTO() {
    }

    public SupplierDTO(Long id, String name, String contactInfo, Boolean active) {
        this.id = id;
        this.name = name;
        this.contactInfo = contactInfo;
        this.active = active;
    }

    public SupplierDTO(Supplier supplier) {
        this.id = (long) supplier.getId();
        this.name = supplier.getName();
        this.contactInfo = supplier.getContactInfo();
        this.active = supplier.isActive();
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

    public String getContactInfo() {
        return contactInfo;
    }

    public void setContactInfo(String contactInfo) {
        this.contactInfo = contactInfo;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}