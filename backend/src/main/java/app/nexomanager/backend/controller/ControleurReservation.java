// ControleurReservation.java
package app.nexomanager.backend.controller;

import app.nexomanager.backend.domain.entity.Reservation;
import app.nexomanager.backend.domain.enums.StatutReservation;
import app.nexomanager.backend.dto.DtosReservation.EvenementCalendrierDto;
import app.nexomanager.backend.dto.DtosReservation.RequeteCreationReservation;
import app.nexomanager.backend.service.ServiceReservation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ControleurReservation {

    private final ServiceReservation serviceReservation;

    @GetMapping("/reservations")
    public ResponseEntity<List<Reservation>> listerReservations() {
        return ResponseEntity.ok(serviceReservation.listerReservations());
    }

    @PostMapping("/reservations")
    public ResponseEntity<Reservation> creerReservation(@Valid @RequestBody RequeteCreationReservation requete) {
        return ResponseEntity.status(HttpStatus.CREATED).body(serviceReservation.creerReservation(requete));
    }

    @PatchMapping("/reservations/{id}/statut")
    public ResponseEntity<Reservation> changerStatut(
            @PathVariable Long id,
            @RequestParam StatutReservation statut
    ) {
        return ResponseEntity.ok(serviceReservation.changerStatutReservation(id, statut));
    }

    @GetMapping("/calendrier/evenements")
    public ResponseEntity<List<EvenementCalendrierDto>> obtenirCalendrier() {
        return ResponseEntity.ok(serviceReservation.obtenirEvenementsCalendrier());
    }
}