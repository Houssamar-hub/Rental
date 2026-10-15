// MessageChatRepository.java
package app.nexomanager.backend.repository;

import app.nexomanager.backend.domain.entity.MessageChat;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MessageChatRepository extends JpaRepository<MessageChat, Long> {
    List<MessageChat> findByClientIdOrderByDateCreationAsc(Long clientId);
    long countByLuFalse();
}