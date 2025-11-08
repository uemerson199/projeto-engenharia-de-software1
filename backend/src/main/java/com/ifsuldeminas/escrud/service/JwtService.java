package com.ifsuldeminas.escrud.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    // 1. Gere uma chave secreta segura.
    // Você pode usar um site como: https://www.allkeysgenerator.com/Random/Security-Key-Generator
    // Escolha 256-bit (32 bytes) e copie o valor HEX.
    // NUNCA deixe essa chave exposta no código em produção. Use variáveis de ambiente.
    // Por agora, para testes, vamos colocar aqui:
    private static final String SECRET_KEY = "SEU_HEX_SECRET_DE_32_BYTES_AQUI"; // TROQUE ISSO

    // Tempo de expiração do token (ex: 30 dias)
    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 30L;

    // Método público para gerar o token
    public String generateToken(UserDetails userDetails) {
        return buildToken(new HashMap<>(), userDetails, EXPIRATION_TIME);
    }

    // Extrai o nome de usuário (login) do token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Verifica se o token é válido
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    // Constrói o token
    private String buildToken(Map<String, Object> extraClaims, UserDetails userDetails, long expiration) {
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername()) // Salva o 'login' no token
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Verifica se o token expirou
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Extrai a data de expiração
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Método genérico para extrair 'claims' (dados) do token
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Extrai todos os dados do token usando a chave secreta
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Obtém a chave secreta para assinar o token
    private SecretKey getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}