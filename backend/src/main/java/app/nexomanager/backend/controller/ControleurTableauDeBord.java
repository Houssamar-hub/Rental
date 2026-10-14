// ControleurTableauDeBord.java
package app.nexomanager.backend.controller;

import app.nexomanager.backend.dto.DtosTableauDeBord.ReponseTableauDeBord;
import app.nexomanager.backend.service.ServiceTableauDeBord;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/tableau-de-bord")
@RequiredArgsConstructor
public class ControleurTableauDeBord {

    private final ServiceTableauDeBord serviceTableauDeBord;

    @GetMapping("/resume")
    public ResponseEntity<ReponseTableauDeBord> obtenirResume() {
        return ResponseEntity.ok(serviceTableauDeBord.obtenirResumeTableauDeBord());
    }
}