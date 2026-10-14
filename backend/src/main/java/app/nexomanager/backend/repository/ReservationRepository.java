// ReservationRepository.java
package app.nexomanager.backend.repository;

import app.nexomanager.backend.domain.entity.Reservation;
import app.nexomanager.backend.domain.enums.StatutReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    long countByStatut(StatutReservation statut);

    @Query("SELECT COALESCE(SUM(r.montantTotal), 0) FROM Reservation r WHERE r.statut <> 'ANNULEE'")
    BigDecimal calculerRevenuTotal();

    @Query("""
        SELECT COUNT(r) > 0 FROM Reservation r
        WHERE r.vehicule.id = :vehiculeId
          AND r.statut = 'EN_COURS'
          AND r.dateHeureDebut < :dateHeureFin
          AND r.dateHeureFin > :dateHeureDebut
    """)
    boolean existeChevauchementReservation(
            @Param("vehiculeId") Long vehiculeId,
            @Param("dateHeureDebut") Instant dateHeureDebut,
            @Param("dateHeureFin") Instant dateHeureFin
    );

    List<Reservation> findByChauffeurIdOrderByDateHeureDebutAsc(Long chauffeurId);
}