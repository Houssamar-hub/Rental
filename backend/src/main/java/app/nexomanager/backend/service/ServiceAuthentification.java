package app.nexomanager.backend.service;

import app.nexomanager.backend.domain.entity.UtilisateurStaff;
import app.nexomanager.backend.dto.DtosAuthentification.ReponseAuthentification;
import app.nexomanager.backend.dto.DtosAuthentification.RequeteConnexion;
import app.nexomanager.backend.dto.DtosAuthentification.RequeteCreationStaff;
import app.nexomanager.backend.exception.ExceptionMetier;
import app.nexomanager.backend.repository.UtilisateurStaffRepository;
import app.nexomanager.backend.security.DetailsUtilisateurStaff;
import app.nexomanager.backend.security.ServiceJwt;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ServiceAuthentification {

    private final AuthenticationManager gestionnaireAuthentification;
    private final UtilisateurStaffRepository utilisateurStaffRepository;
    private final PasswordEncoder encodeurMotDePasse;
    private final ServiceJwt serviceJwt;

    @Transactional(readOnly = true)
    public ReponseAuthentification connecter(RequeteConnexion requete) {
        gestionnaireAuthentification.authenticate(
                new UsernamePasswordAuthenticationToken(requete.email(), requete.motDePasse())
        );
        UtilisateurStaff utilisateur = utilisateurStaffRepository.findByEmailIgnoreCaseAndActifTrue(requete.email())
                .orElseThrow();
        DetailsUtilisateurStaff details = new DetailsUtilisateurStaff(utilisateur);

        return ReponseAuthentification.builder()
                .id(utilisateur.getId())
                .nomComplet(utilisateur.getNomComplet())
                .email(utilisateur.getEmail())
                .role(utilisateur.getRole())
                .jetonAcces(serviceJwt.genererJeton(details))
                .build();
    }

    @Transactional
    public ReponseAuthentification creerCollaborateur(RequeteCreationStaff requete) {
        if (utilisateurStaffRepository.existsByEmailIgnoreCase(requete.email())) {
            throw new ExceptionMetier("Un collaborateur utilise déjà cette adresse email.");
        }
        UtilisateurStaff nouveau = UtilisateurStaff.builder()
                .nomComplet(requete.nomComplet().trim())
                .email(requete.email().trim().toLowerCase())
                .motDePasseHash(encodeurMotDePasse.encode(requete.motDePasse()))
                .telephone(requete.telephone())
                .role(requete.role())
                .actif(true)
                .build();

        UtilisateurStaff sauvegarde = utilisateurStaffRepository.save(nouveau);
        DetailsUtilisateurStaff details = new DetailsUtilisateurStaff(sauvegarde);

        return ReponseAuthentification.builder()
                .id(sauvegarde.getId())
                .nomComplet(sauvegarde.getNomComplet())
                .email(sauvegarde.getEmail())
                .role(sauvegarde.getRole())
                .jetonAcces(serviceJwt.genererJeton(details))
                .build();
    }
}