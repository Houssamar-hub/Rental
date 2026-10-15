// ControleurAuthentification.java
package app.nexomanager.backend.controller;

import app.nexomanager.backend.dto.DtosAuthentification.ReponseAuthentification;
import app.nexomanager.backend.dto.DtosAuthentification.RequeteConnexion;
import app.nexomanager.backend.dto.DtosAuthentification.RequeteCreationStaff;
import app.nexomanager.backend.security.DetailsUtilisateurStaff;
import app.nexomanager.backend.service.ServiceAuthentification;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class ControleurAuthentification {

    private final ServiceAuthentification serviceAuthentification;

    @PostMapping("/connexion")
    public ResponseEntity<ReponseAuthentification> connecter(@Valid @RequestBody RequeteConnexion requete) {
        return ResponseEntity.ok(serviceAuthentification.connecter(requete));
    }

    @PostMapping("/collaborateurs")
    @PreAuthorize("hasAuthority('ROLE_PROPRIETAIRE')")
    public ResponseEntity<ReponseAuthentification> creerCollaborateur(@Valid @RequestBody RequeteCreationStaff requete) {
        return ResponseEntity.status(HttpStatus.CREATED).body(serviceAuthentification.creerCollaborateur(requete));
    }

    @GetMapping("/profil")
    public ResponseEntity<DetailsUtilisateurStaff> profilActuel(@AuthenticationPrincipal DetailsUtilisateurStaff utilisateur) {
        return ResponseEntity.ok(utilisateur);
    }
}