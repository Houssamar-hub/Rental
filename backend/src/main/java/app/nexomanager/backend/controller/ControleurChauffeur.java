// ControleurChauffeur.java
package app.nexomanager.backend.controller;

import app.nexomanager.backend.domain.entity.Chauffeur;
import app.nexomanager.backend.service.ServiceChauffeur;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/chauffeurs")
@RequiredArgsConstructor
public class ControleurChauffeur {

    private final ServiceChauffeur serviceChauffeur;

    @GetMapping
    public ResponseEntity<List<Chauffeur>> listerChauffeurs() {
        return ResponseEntity.ok(serviceChauffeur.listerChauffeurs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> obtenirDetailsChauffeur(@PathVariable Long id) {
        return ResponseEntity.ok(serviceChauffeur.obtenirProfilChauffeurAvecPlanning(id));
    }

    @PostMapping
    public ResponseEntity<Chauffeur> ajouterChauffeur(@Valid @RequestBody Chauffeur chauffeur) {
        return ResponseEntity.status(HttpStatus.CREATED).body(serviceChauffeur.ajouterChauffeur(chauffeur));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Chauffeur> modifierChauffeur(@PathVariable Long id, @Valid @RequestBody Chauffeur chauffeur) {
        return ResponseEntity.ok(serviceChauffeur.modifierChauffeur(id, chauffeur));
    }
}