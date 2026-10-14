// DtosTempsReel.java
package app.nexomanager.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.Instant;

public class DtosTempsReel {

    @Builder
    public record MiseAJourGpsDto(
            @NotNull Long vehiculeId,
            String codeVehicule,
            String modeleVehicule,
            String nomClient,
            @NotNull BigDecimal latitude,
            @NotNull BigDecimal longitude,
            BigDecimal distanceTrajetKm,
            String statut,
            Instant horodatage
    ) {}

    @Builder
    public record MessageTempsReelDto(
            @NotNull Long clientId,
            @NotBlank String contenu,
            String urlPieceJointe,
            String nomExpediteur,
            String typeExpediteur,
            Instant dateEnvoi
    ) {}
}