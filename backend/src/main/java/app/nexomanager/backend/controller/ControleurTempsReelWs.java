// ControleurTempsReelWs.java
package app.nexomanager.backend.controller;

import app.nexomanager.backend.domain.entity.MessageChat;
import app.nexomanager.backend.dto.DtosTempsReel.MessageTempsReelDto;
import app.nexomanager.backend.dto.DtosTempsReel.MiseAJourGpsDto;
import app.nexomanager.backend.service.ServiceTempsReel;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class ControleurTempsReelWs {

    private final ServiceTempsReel serviceTempsReel;

    /**
     * WebSocket STOMP : Envoi sur /app/suivi.gps -> Diffusion sur /topic/suivi
     */
    @MessageMapping("/suivi.gps")
    public void actualiserPositionGps(@Valid @Payload MiseAJourGpsDto miseAJour) {
        serviceTempsReel.traiterEtDiffuserPositionGps(miseAJour);
    }

    /**
     * WebSocket STOMP : Envoi sur /app/chat.envoyer -> Diffusion sur /topic/messages
     */
    @MessageMapping("/chat.envoyer")
    public void envoyerMessageChat(@Valid @Payload MessageTempsReelDto message, Principal principal) {
        String nomStaff = principal != null ? principal.getName() : "Équipe NexoManager";
        serviceTempsReel.enregistrerEtDiffuserMessage(message, nomStaff);
    }

    @GetMapping("/api/v1/messages/client/{clientId}")
    public ResponseEntity<List<MessageChat>> historiqueDiscussion(@PathVariable Long clientId) {
        return ResponseEntity.ok(serviceTempsReel.historiqueMessagesParClient(clientId));
    }
}