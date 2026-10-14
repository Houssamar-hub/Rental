// ControleurVehicule.java
package app.nexomanager.backend.controller;

import app.nexomanager.backend.domain.entity.Vehicule;
import app.nexomanager.backend.domain.enums.CategorieVehicule;
import app.nexomanager.backend.service.ServiceVehicule;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/vehicules")
@RequiredArgsConstructor
public class ControleurVehicule {

    private final ServiceVehicule serviceVehicule;

    @GetMapping
    public ResponseEntity<List<Vehicule>> listerVehicules() {
        return ResponseEntity.ok(serviceVehicule.listerTousLesVehicules());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> obtenirDetails(@PathVariable Long id) {
        return ResponseEntity.ok(serviceVehicule.obtenirDetailsVehicule(id));
    }

    @GetMapping("/disponibilite")
    public ResponseEntity<List<Vehicule>> verifierDisponibilite(
            @RequestParam CategorieVehicule categorie,
            @RequestParam Instant dateHeureDebut,
            @RequestParam Instant dateHeureFin
    ) {
        return ResponseEntity.ok(serviceVehicule.verifierDisponibilite(categorie, dateHeureDebut, dateHeureFin));
    }

    @PostMapping
    public ResponseEntity<Vehicule> ajouter(@Valid @RequestBody Vehicule vehicule) {
        return ResponseEntity.status(HttpStatus.CREATED).body(serviceVehicule.ajouterVehicule(vehicule));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vehicule> modifier(@PathVariable Long id, @Valid @RequestBody Vehicule vehicule) {
        return ResponseEntity.ok(serviceVehicule.modifierVehicule(id, vehicule));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_PROPRIETAIRE')")
    public ResponseEntity<Void> supprimer(@PathVariable Long id) {
        serviceVehicule.supprimerVehicule(id);
        return ResponseEntity.noContent().build();
    }
}