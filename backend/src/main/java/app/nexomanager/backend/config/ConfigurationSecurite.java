// ConfigurationSecurite.java
package app.nexomanager.backend.config;

import app.nexomanager.backend.security.FiltreAuthentificationJwt;
import app.nexomanager.backend.security.ServiceDetailsUtilisateurStaff;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class ConfigurationSecurite {

    private final FiltreAuthentificationJwt filtreJwt;
    private final ServiceDetailsUtilisateurStaff serviceDetailsUtilisateur;

    @Value("${nexomanager.cors.allowed-origins}")
    private String originesAutorisees;

    @Bean
    public SecurityFilterChain chaineFiltresSecurite(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(sourceConfigurationCors()))
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/v1/auth/connexion").permitAll()
                        .requestMatchers("/ws/**").permitAll()
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                        .requestMatchers("/api/v1/finances/depenses/**").hasAuthority("ROLE_PROPRIETAIRE")
                        .anyRequest().hasAnyAuthority("ROLE_PROPRIETAIRE", "ROLE_EMPLOYE")
                )
                .authenticationProvider(fournisseurAuthentification())
                .addFilterBefore(filtreJwt, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationProvider fournisseurAuthentification() {
        DaoAuthenticationProvider fournisseur = new DaoAuthenticationProvider();
        fournisseur.setUserDetailsService(serviceDetailsUtilisateur);
        fournisseur.setPasswordEncoder(encodeurMotDePasse());
        return fournisseur;
    }

    @Bean
    public AuthenticationManager gestionnaireAuthentification(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder encodeurMotDePasse() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource sourceConfigurationCors() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList(originesAutorisees.split(",")));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}