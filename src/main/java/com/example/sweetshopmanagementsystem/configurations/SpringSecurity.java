package com.example.sweetshopmanagementsystem.configurations;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SpringSecurity {

    public SecurityFilterChain  configure(HttpSecurity http) throws Exception {
        return http.csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(
                auth ->
                        auth.requestMatchers("/api/auth/register/*")
                        .permitAll()
                        .requestMatchers("/api/auth/login/*").permitAll()
                                .requestMatchers(HttpMethod.DELETE, "/api/sweets/delete/**")
                                .hasRole("ADMIN")
                                .requestMatchers(HttpMethod.POST, "/api/sweets/*/restock").hasRole("ADMIN")
                                .anyRequest().authenticated()
                )
                .build();

    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
