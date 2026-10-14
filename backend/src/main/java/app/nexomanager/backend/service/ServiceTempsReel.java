// ServiceTempsReel.java
package app.nexomanager.backend.service;

import app.nexomanager.backend.domain.entity.Client;
import app.nexomanager.backend.domain.entity.MessageChat;
import app.nexomanager.backend.domain.entity.Vehicule;
import app.nexomanager.backend.dto.DtosTempsReel.MessageTempsReelDto;
import app.nexomanager.backend.dto.DtosTempsReel.MiseAJourGpsDto;
import app.nexomanager.backend.exception.ExceptionRessourceIntrouvable;
import app.nexomanager.backend.repository.ClientRepository;
import app.nexomanager.backend.repository.MessageChatRepository;
import app.nexomanager.backend.repository.VehiculeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ServiceTempsReel {

    private final SimpMessagingTemplate templateMessagerie;
    private final VehiculeRepository vehiculeRepository;
    private final ClientRepository clientRepository;
    private final MessageChatRepository messageChatRepository;

    @Transactional
    public void traiterEtDiffuserPositionGps(MiseAJourGpsDto miseAJour) {
        Vehicule vehicule = vehiculeRepository.findById(miseAJour.vehiculeId()).orElse(null);
        if (vehicule != null) {
            vehicule.setDerniereLatitude(miseAJour.latitude());
            vehicule.setDerniereLongitude(miseAJour.longitude());
            vehiculeRepository.save(vehicule);
        }

        MiseAJourGpsDto diffusion = MiseAJourGpsDto.builder()
                .vehiculeId(miseAJour.vehiculeId())
                .codeVehicule(vehicule != null ? vehicule.getCodeVehicule() : miseAJour.codeVehicule())
                .modeleVehicule(vehicule != null ? vehicule.getMarque() + " " + vehicule.getModele() : miseAJour.modeleVehicule())
                .nomClient(miseAJour.nomClient())
                .latitude(miseAJour.latitude())
                .longitude(miseAJour.longitude())
                .distanceTrajetKm(miseAJour.distanceTrajetKm())
                .statut(miseAJour.statut())
                .horodatage(Instant.now())
                .build();

        templateMessagerie.convertAndSend("/topic/suivi", diffusion);
    }

    @Transactional
    public void enregistrerEtDiffuserMessage(MessageTempsReelDto payload, String nomStaff) {
        Client client = clientRepository.findById(payload.clientId())
                .orElseThrow(() -> new ExceptionRessourceIntrouvable("Client introuvable : " + payload.clientId()));

        MessageChat message = MessageChat.builder()
                .client(client)
                .typeExpediteur("STAFF")
                .nomExpediteur(nomStaff)
                .contenu(payload.contenu())
                .urlPieceJointe(payload.urlPieceJointe())
                .lu(false)
                .build();
        messageChatRepository.save(message);

        MessageTempsReelDto diffusion = MessageTempsReelDto.builder()
                .clientId(client.getId())
                .contenu(payload.contenu())
                .urlPieceJointe(payload.urlPieceJointe())
                .nomExpediteur(nomStaff)
                .typeExpediteur("STAFF")
                .dateEnvoi(Instant.now())
                .build();

        templateMessagerie.convertAndSend("/topic/messages", diffusion);
    }

    @Transactional(readOnly = true)
    public List<MessageChat> historiqueMessagesParClient(Long clientId) {
        return messageChatRepository.findByClientIdOrderByDateCreationAsc(clientId);
    }
}