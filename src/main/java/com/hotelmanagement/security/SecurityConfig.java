package com.hotelmanagement.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {

        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    /*
     * BCrypt password encoder.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /*
     * Authentication manager used during login.
     */
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();
    }

    /*
     * Application security configuration.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http

                // REST API does not use CSRF tokens
                .csrf(csrf -> csrf.disable())

                // JWT authentication is stateless
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                // Allow iframe for H2 database console
                .headers(headers -> headers.frameOptions(frame -> frame.disable()))

                .authorizeHttpRequests(auth -> auth

                        // Login does not require JWT
                        .requestMatchers(
                                "/api/auth/**"
                        ).permitAll()

                        // H2 Console
                        .requestMatchers(
                                "/h2-console/**"
                        ).permitAll()

                        // Static frontend web app resources
                        .requestMatchers(
                                "/",
                                "/index.html",
                                "/css/**",
                                "/js/**",
                                "/assets/**",
                                "/static/**",
                                "/favicon.ico",
                                "/**.css",
                                "/**.js",
                                "/**.html",
                                "/**.png",
                                "/**.jpg",
                                "/**.jpeg",
                                "/**.svg",
                                "/**.woff",
                                "/**.woff2"
                        ).permitAll()

                        // Swagger/OpenAPI
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**"
                        ).permitAll()

                        // User management = ADMIN only
                        .requestMatchers(
                                "/api/users/**"
                        ).hasRole("ADMIN")

                        // Admin dashboard = ADMIN only
                        .requestMatchers(
                                "/api/admin/**"
                        ).hasRole("ADMIN")

                        // Staff management = ADMIN or STAFF
                        .requestMatchers(
                                "/api/staff/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "STAFF"
                        )

                        // Every remaining API requires login
                        .requestMatchers(
                                "/api/**"
                        ).authenticated()

                        // Everything else requires authentication
                        .anyRequest().authenticated()
                )

                /*
                 * Execute JWT filter before Spring's
                 * username/password authentication filter.
                 */
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}