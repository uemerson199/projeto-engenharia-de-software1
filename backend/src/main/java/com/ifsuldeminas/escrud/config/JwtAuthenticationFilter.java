package com.ifsuldeminas.escrud.config;

import com.ifsuldeminas.escrud.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component // Marca como um componente gerenciado pelo Spring
@RequiredArgsConstructor // Cria um construtor com os campos 'final'
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService; // O bean que criamos no SecurityConfig

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // 1. Pega o cabeçalho 'Authorization' da requisição
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;

        // 2. Verifica se o cabeçalho existe e se começa com "Bearer "
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            // Se não tiver o token, apenas continua para o próximo filtro
            filterChain.doFilter(request, response);
            return;
        }

        // 3. Extrai o token (remove o "Bearer ")
        jwt = authHeader.substring(7);

        // 4. Extrai o 'username' (login) de dentro do token
        username = jwtService.extractUsername(jwt);

        // 5. Verifica se o usuário não está "autenticado" no contexto de segurança
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            
            // 6. Carrega o usuário do banco de dados (agora é um UserDetails)
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            // 7. Valida o token (compara com o usuário do banco)
            if (jwtService.isTokenValid(jwt, userDetails)) {
                
                // 8. Se o token for válido, cria a autenticação
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null, // Credenciais (senha) são nulas, pois usamos token
                        userDetails.getAuthorities()
                );
                
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                // 9. Salva a autenticação no Contexto de Segurança do Spring
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        
        // 10. Continua para o próximo filtro
        filterChain.doFilter(request, response);
    }
}