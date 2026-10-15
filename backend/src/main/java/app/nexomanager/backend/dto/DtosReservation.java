// DtosReservation.java
package app.nexomanager.backend.dto;

import app.nexomanager.backend.domain.enums.StatutPaiement;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.Instant;

public class DtosReservation {

    public record RequeteCreationReservation(
            @NotNull Long clientId,
            @NotNull Long vehiculeId,
            Long chauffeurId,
            @NotNull Instant dateHeureDebut,
            @NotNull Instant dateHeureFin,
            StatutPaiement statutPaiement,
            String notes
    ) {}

    @Builder
    public record EvenementCalendrierDto(
            Long reservationId,
            String codeReservation,
            String typeEvenement, // DEPART (Pickup) ou RETOUR (Return)
            Instant dateHeure,
            String nomClient,
            String nomChauffeur,
            String modeleVehicule,
            String codeVehicule,
            String notes
    ) {}

    @Builder
    public record ResumeReservationsDto(
            long reservationsEnCours,
            long reservationsEnAttentePaiement,
            long reservationsAnnulees,
            long reservationsTerminees,
            BigDecimal montantTotalReservations
    ) {}
}