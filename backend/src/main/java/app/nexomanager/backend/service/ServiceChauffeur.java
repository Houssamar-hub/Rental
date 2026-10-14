// ServiceChauffeur.java
package app.nexomanager.backend.service;

import app.nexomanager.backend.domain.entity.Chauffeur;
import app.nexomanager.backend.domain.entity.Reservation;
import app.nexomanager.backend.exception.ExceptionRessourceIntrouvable;
import app.nexomanager.backend.repository.ChauffeurRepository;
import app.nexomanager.backend.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ServiceChauffeur {

    private final ChauffeurRepository chauffeurRepository;
    private final ReservationRepository reservationRepository;

    @Transactional(readOnly = true)
    public List<Chauffeur> listerChauffeurs() {
        return chauffeurRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Map<String, Object> obtenirProfilChauffeurAvecPlanning(Long id) {
        Chauffeur chauffeur = chauffeurRepository.findById(id)
                .orElseThrow(() -> new ExceptionRessourceIntrouvable("Chauffeur introuvable : " + id));
        List<Reservation> planningCourses = reservationRepository.findByChauffeurIdOrderByDateHeureDebutAsc(id);
        return Map.of("chauffeur", chauffeur, "planning", planningCourses);
    }

    @Transactional
    public Chauffeur ajouterChauffeur(Chauffeur chauffeur) {
        return chauffeurRepository.save(chauffeur);
    }

    @Transactional
    public Chauffeur modifierChauffeur(Long id, Chauffeur donnees) {
        Chauffeur existant = chauffeurRepository.findById(id)
                .orElseThrow(() -> new ExceptionRessourceIntrouvable("Chauffeur introuvable : " + id));
        existant.setNomComplet(donnees.getNomComplet());
        existant.setTelephone(donnees.getTelephone());
        existant.setAdresse(donnees.getAdresse());
        existant.setStatut(donnees.getStatut());
        existant.setHeuresTravaillees(donnees.getHeuresTravaillees());
        existant.setNotePerformance(donnees.getNotePerformance());
        return chauffeurRepository.save(existant);
    }
}