package app.nexomanager.backend.domain.entity;

import app.nexomanager.backend.domain.enums.StatutChauffeur;
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

import java.math.BigDecimal;

@Entity
@Table(name = "chauffeurs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Chauffeur extends EntiteBase {

    @Column(name = "nom_complet", nullable = false, length = 120)
    private String nomComplet;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(nullable = false, length = 30)
    private String telephone;

    private String adresse;

    @Column(name = "url_avatar", length = 500)
    private String urlAvatar;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false, length = 30)
    private StatutChauffeur statut = StatutChauffeur.EN_SERVICE;

    @Builder.Default
    @Column(name = "heures_travaillees", nullable = false)
    private Integer heuresTravaillees = 0;

    @Builder.Default
    @Column(name = "note_performance", nullable = false, precision = 3, scale = 2)
    private BigDecimal notePerformance = new BigDecimal("4.50");
}