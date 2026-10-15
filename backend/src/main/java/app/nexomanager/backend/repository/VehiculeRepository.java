// VehiculeRepository.java
package app.nexomanager.backend.repository;

import app.nexomanager.backend.domain.entity.Vehicule;
import app.nexomanager.backend.domain.enums.CategorieVehicule;
import app.nexomanager.backend.domain.enums.StatutVehicule;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface VehiculeRepository extends JpaRepository<Vehicule, Long> {
    long countByStatut(StatutVehicule statut);
    long countByCategorie(CategorieVehicule categorie);
    List<Vehicule> findByCategorieAndStatut(CategorieVehicule categorie, StatutVehicule statut);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT v FROM Vehicule v WHERE v.id = :id")
    Optional<Vehicule> findByIdAvecVerrou(@Param("id") Long id);
}