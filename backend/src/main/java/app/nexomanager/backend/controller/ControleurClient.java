// ControleurClient.java
package app.nexomanager.backend.controller;

import app.nexomanager.backend.domain.entity.Client;
import app.nexomanager.backend.service.ServiceClient;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/clients")
@RequiredArgsConstructor
public class ControleurClient {

    private final ServiceClient serviceClient;

    @GetMapping
    public ResponseEntity<List<Client>> listerClients(@RequestParam(required = false) String recherche) {
        return ResponseEntity.ok(serviceClient.listerClients(recherche));
    }

    @PostMapping
    public ResponseEntity<Client> ajouterClient(@Valid @RequestBody Client client) {
        return ResponseEntity.status(HttpStatus.CREATED).body(serviceClient.ajouterClient(client));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Client> modifierClient(@PathVariable Long id, @Valid @RequestBody Client client) {
        return ResponseEntity.ok(serviceClient.modifierClient(id, client));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_PROPRIETAIRE')")
    public ResponseEntity<Void> supprimerClient(@PathVariable Long id) {
        serviceClient.supprimerClient(id);
        return ResponseEntity.noContent().build();
    }
}