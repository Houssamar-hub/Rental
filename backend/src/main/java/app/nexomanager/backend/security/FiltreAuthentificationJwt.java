// FiltreAuthentificationJwt.java
package app.nexomanager.backend.security;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class FiltreAuthentificationJwt extends OncePerRequestFilter {

    private final ServiceJwt serviceJwt;
    private final ServiceDetailsUtilisateurStaff serviceDetailsUtilisateur;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest requete,
            @NonNull HttpServletResponse reponse,
            @NonNull FilterChain chaineFiltres
    ) throws ServletException, IOException {

        String enteteAuth = requete.getHeader(HttpHeaders.AUTHORIZATION);
        if (enteteAuth == null || !enteteAuth.startsWith("Bearer ")) {
            chaineFiltres.doFilter(requete, reponse);
            return;
        }

        String jeton = enteteAuth.substring(7);
        try {
            String email = serviceJwt.extraireEmail(jeton);
            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails details = serviceDetailsUtilisateur.loadUserByUsername(email);
                if (serviceJwt.estJetonValide(jeton, details) && details.isEnabled()) {
                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                            details, null, details.getAuthorities()
                    );
                    auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(requete));
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            }
        } catch (JwtException | IllegalArgumentException ignore) {
        }

        chaineFiltres.doFilter(requete, reponse);
    }
}