// UtilisateurStaffRepository.java
package app.nexomanager.backend.repository;

import app.nexomanager.backend.domain.entity.UtilisateurStaff;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UtilisateurStaffRepository extends JpaRepository<UtilisateurStaff, Long> {
    Optional<UtilisateurStaff> findByEmailIgnoreCaseAndActifTrue(String email);
    boolean existsByEmailIgnoreCase(String email);
}