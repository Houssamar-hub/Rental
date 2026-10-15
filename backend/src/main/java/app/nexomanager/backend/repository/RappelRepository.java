// RappelRepository.java
package app.nexomanager.backend.repository;

import app.nexomanager.backend.domain.entity.Rappel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RappelRepository extends JpaRepository<Rappel, Long> {
    List<Rappel> findByTermineFalseOrderByDateRappelAsc();
    List<Rappel> findByVehiculeIdOrderByDateRappelAsc(Long vehiculeId);
}