// FactureRepository.java
package app.nexomanager.backend.repository;

import app.nexomanager.backend.domain.entity.Facture;
import app.nexomanager.backend.domain.enums.StatutFacture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

public interface FactureRepository extends JpaRepository<Facture, Long> {
    @Query("SELECT COALESCE(SUM(f.montant), 0) FROM Facture f WHERE f.statut = :statut")
    BigDecimal calculerSommeParStatut(@Param("statut") StatutFacture statut);
}