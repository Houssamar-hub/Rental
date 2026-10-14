// ChauffeurRepository.java
package app.nexomanager.backend.repository;

import app.nexomanager.backend.domain.entity.Chauffeur;
import app.nexomanager.backend.domain.enums.StatutChauffeur;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChauffeurRepository extends JpaRepository<Chauffeur, Long> {
    List<Chauffeur> findByStatut(StatutChauffeur statut);
}