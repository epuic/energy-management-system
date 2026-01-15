package com.example.gateway_service.filter;

import com.example.gateway_service.util.JwtUtil;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtAuthenticationFilter implements GlobalFilter, Ordered {
    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();

        if (path.startsWith("/api/auth/")
                || path.equals("/api/users/create-with-id")
                || path.equals("/api/users/me")
                || path.equals("/api/monitoring/**")) {
            return chain.filter(exchange);
        }

        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        try {
            String token = authHeader.substring(7);
            Claims claims = jwtUtil.parse(token);

            Object rolesClaim = claims.get("roles");
            String rolesHeader;
            if (rolesClaim instanceof List<?> list) {
                rolesHeader = list.stream().map(Object::toString).collect(Collectors.joining(","));
            } else {
                rolesHeader = String.valueOf(rolesClaim);
            }

            ServerHttpRequest mutated = exchange.getRequest().mutate()
                    .header("X-Auth-Username", claims.getSubject())
                    .header("X-Auth-Roles", rolesHeader)
                    .build();

            return chain.filter(exchange.mutate().request(mutated).build());
        } catch (Exception e) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }
    }

    @Override
    public int getOrder() {
        return -1;
    }
}
