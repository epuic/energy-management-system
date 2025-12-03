package com.example.device_service.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class JwtFilter extends OncePerRequestFilter {
    private final Key key;

    public JwtFilter(String secret) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    private String normalizeRole(String r) {
        if (r == null) return null;
        r = r.trim();
        if (r.isEmpty()) return null;
        return r.startsWith("ROLE_") ? r : "ROLE_" + r;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        String xUser = request.getHeader("X-Auth-Username");
        String xRoles = request.getHeader("X-Auth-Roles"); // ex: "ADMIN,CLIENT"

        String username = null;
        Collection<GrantedAuthority> authorities = new ArrayList<>();

        try {
            if (xUser != null && xRoles != null) {
                username = xUser;
                for (String r : xRoles.split(",")) {
                    String norm = normalizeRole(r);
                    if (norm != null) authorities.add(new SimpleGrantedAuthority(norm));
                }
            } else if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                Claims claims = Jwts.parserBuilder().setSigningKey(key).build()
                        .parseClaimsJws(token).getBody();
                username = claims.getSubject();

                Object rolesClaim = claims.get("roles");
                if (rolesClaim instanceof List<?> list) {
                    for (Object r : list) {
                        String norm = normalizeRole(String.valueOf(r));
                        if (norm != null) authorities.add(new SimpleGrantedAuthority(norm));
                    }
                } else if (rolesClaim instanceof String s) {
                    for (String r : s.split(",")) {
                        String norm = normalizeRole(r);
                        if (norm != null) authorities.add(new SimpleGrantedAuthority(norm));
                    }
                }
            }

            if (username != null) {
                var auth = new UsernamePasswordAuthenticationToken(username, null, authorities);
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        try {
            filterChain.doFilter(request, response);
        } finally {
            SecurityContextHolder.clearContext();
        }
    }
}