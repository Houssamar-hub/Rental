// ClientRepository.java
package app.nexomanager.backend.repository;

import app.nexomanager.backend.domain.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ClientRepository extends JpaRepository<Client, Long> {
    List<Client> findByNomCompletContainingIgnoreCaseOrEmailContainingIgnoreCase(String nom, String email);
}