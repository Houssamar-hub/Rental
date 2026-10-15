// ServiceClient.java
package app.nexomanager.backend.service;

import app.nexomanager.backend.domain.entity.Client;
import app.nexomanager.backend.exception.ExceptionRessourceIntrouvable;
import app.nexomanager.backend.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ServiceClient {

    private final ClientRepository clientRepository;

    @Transactional(readOnly = true)
    public List<Client> listerClients(String recherche) {
        if (recherche != null && !recherche.isBlank()) {
            return clientRepository.findByNomCompletContainingIgnoreCaseOrEmailContainingIgnoreCase(recherche, recherche);
        }
        return clientRepository.findAll();
    }

    @Transactional
    public Client ajouterClient(Client client) {
        return clientRepository.save(client);
    }

    @Transactional
    public Client modifierClient(Long id, Client donnees) {
        Client existant = clientRepository.findById(id)
                .orElseThrow(() -> new ExceptionRessourceIntrouvable("Client introuvable : " + id));
        existant.setNomComplet(donnees.getNomComplet());
        existant.setEmail(donnees.getEmail());
        existant.setTelephone(donnees.getTelephone());
        existant.setAdresse(donnees.getAdresse());
        existant.setUrlCarteIdentite(donnees.getUrlCarteIdentite());
        existant.setUrlPermisConduire(donnees.getUrlPermisConduire());
        existant.setPointsFidelite(donnees.getPointsFidelite());
        return clientRepository.save(existant);
    }

    @Transactional
    public void supprimerClient(Long id) {
        clientRepository.deleteById(id);
    }
}