// ControleurFinance.java
package app.nexomanager.backend.controller;

import app.nexomanager.backend.domain.entity.Depense;
import app.nexomanager.backend.domain.entity.Facture;
import app.nexomanager.backend.dto.DtosFinance.ResumeDepensesDto;
import app.nexomanager.backend.dto.DtosFinance.ResumePaiementsDto;
import app.nexomanager.backend.service.ServiceFinance;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/finances")
@RequiredArgsConstructor
public class ControleurFinance {

    private final ServiceFinance serviceFinance;

    @GetMapping("/paiements")
    public ResponseEntity<ResumePaiementsDto> obtenirPaiements() {
        return ResponseEntity.ok(serviceFinance.obtenirResumePaiements());
    }

    @PostMapping("/factures")
    public ResponseEntity<Facture> creerFacture(@Valid @RequestBody Facture facture) {
        return ResponseEntity.status(HttpStatus.CREATED).body(serviceFinance.creerFacture(facture));
    }

    @GetMapping("/depenses")
    @PreAuthorize("hasAuthority('ROLE_PROPRIETAIRE')")
    public ResponseEntity<ResumeDepensesDto> obtenirDepenses() {
        return ResponseEntity.ok(serviceFinance.obtenirResumeDepenses());
    }

    @PostMapping("/depenses")
    @PreAuthorize("hasAuthority('ROLE_PROPRIETAIRE')")
    public ResponseEntity<Depense> ajouterDepense(@Valid @RequestBody Depense depense) {
        return ResponseEntity.status(HttpStatus.CREATED).body(serviceFinance.ajouterDepense(depense));
    }
}