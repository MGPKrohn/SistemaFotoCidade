package com.example.fotocidade.config;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Aplica a configuração a TODOS os endpoints
                .allowedOrigins("http://localhost:5173") // 🎯 IMPORTANTE: Aqui você define a origem do seu frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Permite todos os métodos que você usa
                .allowedHeaders("*") // Permite todos os cabeçalhos
                .allowCredentials(true); // Permite o envio de cookies de sessão, etc. (se for o caso)

    }
}