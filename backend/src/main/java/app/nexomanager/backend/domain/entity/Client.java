package app.nexomanager.backend.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "clients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Client extends EntiteBase {

    @Column(name = "nom_complet", nullable = false, length = 120)
    private String nomComplet;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(nullable = false, length = 30)
    private String telephone;

    @Column(nullable = false)
    private String adresse;

    @Column(name = "url_avatar", length = 500)
    private String urlAvatar;

    @Column(name = "url_carte_identite", length = 500)
    private String urlCarteIdentite;

    @Column(name = "url_permis_conduire", length = 500)
    private String urlPermisConduire;

    @Builder.Default
    @Column(name = "points_fidelite", nullable = false)
    private Integer pointsFidelite = 0;
}