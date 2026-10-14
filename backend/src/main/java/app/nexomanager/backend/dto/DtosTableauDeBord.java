// DtosTableauDeBord.java
package app.nexomanager.backend.dto;

import app.nexomanager.backend.domain.entity.Rappel;
import app.nexomanager.backend.domain.entity.Reservation;
import lombok.Builder;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class DtosTableauDeBord {

    @Builder
    public record RepartitionStatutLocation(
            long nombreLouees,
            long nombreEnAttente,
            long nombreAnnulees,
            int pourcentageLouees,
            int pourcentageEnAttente,
            int pourcentageAnnulees
    ) {}

    @Builder
    public record ReponseTableauDeBord(
            BigDecimal revenuTotal,
            long totalReservations,
            long vehiculesLoues,
            long vehiculesDisponibles,
            RepartitionStatutLocation statutLocations,
            Map<String, Long> repartitionCategories,
            List<Rappel> rappelsActifs,
            List<Reservation> reservationsRecentes
    ) {}
}