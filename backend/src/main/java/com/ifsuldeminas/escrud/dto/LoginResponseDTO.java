package com.ifsuldeminas.escrud.dto;

public record LoginResponseDTO(
    String token,
    Integer userId,
    String name,
    String role
) {
}