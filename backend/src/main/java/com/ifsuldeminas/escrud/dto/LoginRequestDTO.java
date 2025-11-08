package com.ifsuldeminas.escrud.dto;

// Usar um 'record' é a forma mais moderna e simples de criar um DTO
// imutável no Java 21.
public record LoginRequestDTO(
    String login,
    String password
) {
}