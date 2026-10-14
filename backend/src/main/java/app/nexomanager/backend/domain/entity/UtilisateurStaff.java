package app.nexomanager.backend.domain.entity;

import app.nexomanager.backend.domain.enums.RoleStaff;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "utilisateurs_staff")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UtilisateurStaff extends EntiteBase {

    @Column(name = "nom_complet", nullable = false, length = 120)
    private String nomComplet;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "mot_de_passe_hash", nullable = false)
    private String motDePasseHash;

    @Column(length = 30)
    private String telephone;

    @Column(name = "url_avatar", length = 500)
    private String urlAvatar;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private RoleStaff role;

    @Builder.Default
    @Column(nullable = false)
    private boolean actif = true;
}