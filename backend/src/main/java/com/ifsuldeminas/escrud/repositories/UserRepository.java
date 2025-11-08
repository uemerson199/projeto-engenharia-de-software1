package com.ifsuldeminas.escrud.repositories;

import com.ifsuldeminas.escrud.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    // Método que o Spring Data JPA implementará automaticamente
    // para buscar um usuário pelo campo 'login'
    Optional<User> findByLogin(String login);
}