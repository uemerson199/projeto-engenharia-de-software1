package com.ifsuldeminas.escrud.dto;

public record RegisterRequestDTO(
        String name,
        String login,
        String password,
        String role
) {
}