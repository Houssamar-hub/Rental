// DepenseRepository.java
package app.nexomanager.backend.repository;

import app.nexomanager.backend.domain.entity.Depense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;

public interface DepenseRepository extends JpaRepository<Depense, Long> {
    @Query("SELECT COALESCE(SUM(d.montant), 0) FROM Depense d WHERE d.statut = 'COMPLETEE'")
    BigDecimal calculerTotalDepensesCompletees();
}