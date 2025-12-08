package com.ifsuldeminas.escrud.service;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;

import javax.crypto.SecretKey;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JwtServiceTest {

    private JwtService jwtService;

    @Mock
    private UserDetails userDetails;

    private static final String SECRET_KEY = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
    }

    @Test
    @DisplayName("Deve gerar token e extrair username corretamente")
    void generateToken_ShouldReturnToken_AndExtractUsername() {
        String expectedUsername = "usuario.teste";
        when(userDetails.getUsername()).thenReturn(expectedUsername);

        String token = jwtService.generateToken(userDetails);
        String extractedUsername = jwtService.extractUsername(token);

        assertNotNull(token);
        assertFalse(token.isEmpty());
        assertEquals(expectedUsername, extractedUsername);
    }

    @Test
    @DisplayName("isTokenValid deve retornar true para token válido e usuário correto")
    void isTokenValid_ShouldReturnTrue_WhenUserMatches() {
        String username = "usuario.valido";
        when(userDetails.getUsername()).thenReturn(username);

        String token = jwtService.generateToken(userDetails);

        boolean isValid = jwtService.isTokenValid(token, userDetails);

        assertTrue(isValid);
    }

    @Test
    @DisplayName("isTokenValid deve retornar false (ou falhar na extração) quando usuário é diferente")
    void isTokenValid_ShouldReturnFalse_WhenUserDoesNotMatch() {
        when(userDetails.getUsername()).thenReturn("usuario.correto");
        String token = jwtService.generateToken(userDetails);

        UserDetails outroUsuario = org.mockito.Mockito.mock(UserDetails.class);
        when(outroUsuario.getUsername()).thenReturn("usuario.intruso");

        boolean isValid = jwtService.isTokenValid(token, outroUsuario);

        assertFalse(isValid);
    }

    @Test
    @DisplayName("Deve lançar ExpiredJwtException quando o token estiver expirado")
    void validateToken_ShouldThrowException_WhenTokenIsExpired() {

        String expiredToken = Jwts.builder()
                .subject("usuario.expirado")
                .issuedAt(new Date(System.currentTimeMillis() - 1000 * 60 * 60 * 24))
                .expiration(new Date(System.currentTimeMillis() - 1000 * 60))
                .signWith(getSignInKey(), Jwts.SIG.HS256)
                .compact();

        assertThrows(ExpiredJwtException.class, () -> {
            jwtService.extractUsername(expiredToken);
        });
    }

    private SecretKey getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}