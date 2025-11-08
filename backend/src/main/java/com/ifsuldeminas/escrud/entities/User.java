package com.ifsuldeminas.escrud.entities;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails; // Importe
import java.util.Collection;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "users")
public class User implements UserDetails { // Implemente a interface

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String login;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private boolean active = true;

    @OneToMany(mappedBy = "user")
    @ToString.Exclude
    private Set<StockMovement> stockMovements;

    // --- Métodos do UserDetails ---

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Define o 'role' do usuário para o Spring Security
        return List.of(new SimpleGrantedAuthority(role));
    }

    @Override
    public String getPassword() {
        // Informa qual campo é a senha
        return passwordHash;
    }

    @Override
    public String getUsername() {
        // Informa qual campo é o username (no nosso caso, 'login')
        return login;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Pode definir lógicas de expiração aqui
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Pode definir lógicas de bloqueio aqui
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Pode definir lógicas de expiração de credencial
    }

    @Override
    public boolean isEnabled() {
        // Usa o campo 'active' da nossa entidade
        return this.active;
    }
}