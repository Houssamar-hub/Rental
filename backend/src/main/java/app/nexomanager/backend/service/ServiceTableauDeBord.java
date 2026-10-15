package app.nexomanager.backend.service;

import app.nexomanager.backend.domain.enums.CategorieVehicule;
import app.nexomanager.backend.domain.enums.StatutReservation;
import app.nexomanager.backend.domain.enums.StatutVehicule;
import app.nexomanager.backend.dto.DtosTableauDeBord.RepartitionStatutLocation;
import app.nexomanager.backend.dto.DtosTableauDeBord.ReponseTableauDeBord;
import app.nexomanager.backend.repository.RappelRepository;
import app.nexomanager.backend.repository.ReservationRepository;
import app.nexomanager.backend.repository.VehiculeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ServiceTableauDeBord {

    private final ReservationRepository reservationRepository;
    private final VehiculeRepository vehiculeRepository;
    private final RappelRepository rappelRepository;

    @Transactional(readOnly = true)
    public ReponseTableauDeBord obtenirResumeTableauDeBord() {
        long totalReservations = Math.max(1, reservationRepository.count());
        long enCours = reservationRepository.countByStatut(StatutReservation.EN_COURS);
        long retournees = reservationRepository.countByStatut(StatutReservation.RETOURNEE);
        long annulees = reservationRepository.countByStatut(StatutReservation.ANNULEE);

        long totalLouees = enCours + retournees;
        RepartitionStatutLocation statutLocations = RepartitionStatutLocation.builder()
                .nombreLouees(totalLouees)
                .nombreEnAttente(enCours)
                .nombreAnnulees(annulees)
                .pourcentageLouees((int) Math.round((totalLouees * 100.0) / totalReservations))
                .pourcentageEnAttente((int) Math.round((enCours * 100.0) / totalReservations))
                .pourcentageAnnulees((int) Math.round((annulees * 100.0) / totalReservations))
                .build();

        Map<String, Long> categories = new LinkedHashMap<>();
        for (CategorieVehicule categorie : CategorieVehicule.values()) {
            categories.put(categorie.name(), vehiculeRepository.countByCategorie(categorie));
        }

        return ReponseTableauDeBord.builder()
                .revenuTotal(reservationRepository.calculerRevenuTotal())
                .totalReservations(reservationRepository.count())
                .vehiculesLoues(vehiculeRepository.countByStatut(StatutVehicule.EN_TRAJET) + enCours)
                .vehiculesDisponibles(vehiculeRepository.countByStatut(StatutVehicule.DISPONIBLE))
                .statutLocations(statutLocations)
                .repartitionCategories(categories)
                .rappelsActifs(rappelRepository.findByTermineFalseOrderByDateRappelAsc())
                .reservationsRecentes(reservationRepository.findAll())
                .build();
    }
}