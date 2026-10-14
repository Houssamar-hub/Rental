// ServiceJwt.java
package app.nexomanager.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;

@Service
public class ServiceJwt {

    private final SecretKey cleSecrete;
    private final long dureeExpirationMs;

    public ServiceJwt(
            @Value("${nexomanager.security.jwt.secret-base64}") String secretBase64,
            @Value("${nexomanager.security.jwt.expiration-ms}") long dureeExpirationMs
    ) {
        this.cleSecrete = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretBase64));
        this.dureeExpirationMs = dureeExpirationMs;
    }

    public String genererJeton(DetailsUtilisateurStaff utilisateur) {
        long maintenant = System.currentTimeMillis();
        return Jwts.builder()
                .claims(Map.of(
                        "utilisateurId", utilisateur.getId(),
                        "nomComplet", utilisateur.getNomComplet(),
                        "role", utilisateur.getRole().name(),
                        "domaine", "NexoManager.app"
                ))
                .subject(utilisateur.getUsername())
                .issuedAt(new Date(maintenant))
                .expiration(new Date(maintenant + dureeExpirationMs))
                .signWith(cleSecrete, Jwts.SIG.HS256)
                .compact();
    }

    public String extraireEmail(String jeton) {
        return extraireClaims(jeton).getSubject();
    }

    public boolean estJetonValide(String jeton, UserDetails userDetails) {
        Claims claims = extraireClaims(jeton);
        return claims.getSubject().equalsIgnoreCase(userDetails.getUsername())
                && claims.getExpiration().after(new Date());
    }

    private Claims extraireClaims(String jeton) {
        return Jwts.parser()
                .verifyWith(cleSecrete)
                .build()
                .parseSignedClaims(jeton)
                .getPayload();
    }
}