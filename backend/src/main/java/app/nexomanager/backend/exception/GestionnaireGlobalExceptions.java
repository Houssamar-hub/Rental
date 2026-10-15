// GestionnaireGlobalExceptions.java
package app.nexomanager.backend.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GestionnaireGlobalExceptions {

    @ExceptionHandler(ExceptionRessourceIntrouvable.class)
    public ResponseEntity<Map<String, Object>> gererIntrouvable(ExceptionRessourceIntrouvable ex, HttpServletRequest req) {
        return construireReponse(HttpStatus.NOT_FOUND, ex.getMessage(), req.getRequestURI());
    }

    @ExceptionHandler(ExceptionMetier.class)
    public ResponseEntity<Map<String, Object>> gererErreurMetier(ExceptionMetier ex, HttpServletRequest req) {
        return construireReponse(HttpStatus.CONFLICT, ex.getMessage(), req.getRequestURI());
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> gererIdentifiantsInvalides(BadCredentialsException ex, HttpServletRequest req) {
        return construireReponse(HttpStatus.UNAUTHORIZED, "Email ou mot de passe incorrect.", req.getRequestURI());
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> gererAccesRefuse(AccessDeniedException ex, HttpServletRequest req) {
        return construireReponse(HttpStatus.FORBIDDEN, "Accès refusé : droits insuffisants.", req.getRequestURI());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> gererValidation(MethodArgumentNotValidException ex, HttpServletRequest req) {
        return construireReponse(HttpStatus.BAD_REQUEST, "Données du formulaire invalides.", req.getRequestURI());
    }

    private ResponseEntity<Map<String, Object>> construireReponse(HttpStatus statut, String message, String chemin) {
        Map<String, Object> corps = new LinkedHashMap<>();
        corps.put("horodatage", Instant.now());
        corps.put("statut", statut.value());
        corps.put("message", message);
        corps.put("chemin", chemin);
        return ResponseEntity.status(statut).body(corps);
    }
}