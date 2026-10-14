package app.nexomanager.backend.service;

import app.nexomanager.backend.domain.entity.Rappel;
import app.nexomanager.backend.domain.entity.Vehicule;
import app.nexomanager.backend.domain.enums.CategorieVehicule;
import app.nexomanager.backend.domain.enums.StatutVehicule;
import app.nexomanager.backend.exception.ExceptionRessourceIntrouvable;
import app.nexomanager.backend.repository.RappelRepository;
import app.nexomanager.backend.repository.ReservationRepository;
import app.nexomanager.backend.repository.VehiculeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ServiceVehicule {

    private final VehiculeRepository vehiculeRepository;
    private final RappelRepository rappelRepository;
    private final ReservationRepository reservationRepository;

    @Transactional(readOnly = true)
    public List<Vehicule> listerTousLesVehicules() {
        return vehiculeRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Map<String, Object> obtenirDetailsVehicule(Long id) {
        Vehicule vehicule = vehiculeRepository.findById(id)
                .orElseThrow(() -> new ExceptionRessourceIntrouvable("Véhicule introuvable avec l'ID : " + id));
        List<Rappel> rappels = rappelRepository.findByVehiculeIdOrderByDateRappelAsc(id);
        return Map.of("vehicule", vehicule, "rappels", rappels);
    }

    @Transactional(readOnly = true)
    public List<Vehicule> verifierDisponibilite(CategorieVehicule categorie, Instant debut, Instant fin) {
        return vehiculeRepository.findByCategorieAndStatut(categorie, StatutVehicule.DISPONIBLE)
                .stream()
                .filter(v -> !reservationRepository.existeChevauchementReservation(v.getId(), debut, fin))
                .toList();
    }

    @Transactional
    public Vehicule ajouterVehicule(Vehicule vehicule) {
        return vehiculeRepository.save(vehicule);
    }

    @Transactional
    public Vehicule modifierVehicule(Long id, Vehicule donnees) {
        Vehicule existant = vehiculeRepository.findById(id)
                .orElseThrow(() -> new ExceptionRessourceIntrouvable("Véhicule introuvable : " + id));
        existant.setMarque(donnees.getMarque());
        existant.setModele(donnees.getModele());
        existant.setCategorie(donnees.getCategorie());
        existant.setStatut(donnees.getStatut());
        existant.setTarifJournalier(donnees.getTarifJournalier());
        existant.setQuantiteStock(donnees.getQuantiteStock());
        existant.setKilometrageAnnuel(donnees.getKilometrageAnnuel());
        existant.setDescriptionApropos(donnees.getDescriptionApropos());
        existant.setEquipementsJson(donnees.getEquipementsJson());
        return vehiculeRepository.save(existant);
    }

    @Transactional
    public void supprimerVehicule(Long id) {
        vehiculeRepository.deleteById(id);
    }
}