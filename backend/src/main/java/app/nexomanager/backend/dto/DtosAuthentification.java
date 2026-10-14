// DtosAuthentification.java
package app.nexomanager.backend.dto;

import app.nexomanager.backend.domain.enums.RoleStaff;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

public class DtosAuthentification {

    public record RequeteConnexion(
            @NotBlank @Email String email,
            @NotBlank String motDePasse
    ) {}

    public record RequeteCreationStaff(
            @NotBlank String nomComplet,
            @NotBlank @Email String email,
            @NotBlank String motDePasse,
            String telephone,
            @NotNull RoleStaff role
    ) {}

    @Builder
    public record ReponseAuthentification(
            Long id,
            String nomComplet,
            String email,
            RoleStaff role,
            String jetonAcces
    ) {}
}