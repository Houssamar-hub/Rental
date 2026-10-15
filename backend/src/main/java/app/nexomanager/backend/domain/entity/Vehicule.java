package app.nexomanager.backend.domain.entity;

import app.nexomanager.backend.domain.enums.CategorieVehicule;
import app.nexomanager.backend.domain.enums.StatutVehicule;
import app.nexomanager.backend.domain.enums.TypeCarburant;
import app.nexomanager.backend.domain.enums.TypeTransmission;
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
@Table(name = "vehicules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vehicule extends EntiteBase {

    @Column(name = "code_vehicule", nullable = false, unique = true, length = 30)
    private String codeVehicule;

    @Column(nullable = false, unique = true, length = 30)
    private String matricule;

    @Column(nullable = false, length = 80)
    private String marque;

    @Column(nullable = false, length = 80)
    private String modele;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private CategorieVehicule categorie;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false, length = 30)
    private StatutVehicule statut = StatutVehicule.DISPONIBLE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TypeTransmission transmission;

    @Enumerated(EnumType.STRING)
    @Column(name = "type_carburant", nullable = false, length = 20)
    private TypeCarburant typeCarburant;

    @Builder.Default
    @Column(name = "nombre_places", nullable = false)
    private Integer nombrePlaces = 5;

    @Column(name = "tarif_journalier", nullable = false, precision = 10, scale = 2)
    private BigDecimal tarifJournalier;

    @Builder.Default
    @Column(name = "quantite_stock", nullable = false)
    private Integer quantiteStock = 1;

    @Column(name = "autonomie_description", length = 80)
    private String autonomieDescription;

    @Column(name = "vitesse_maximale", length = 50)
    private String vitesseMaximale;

    @Column(length = 60)
    private String acceleration;

    @Builder.Default
    @Column(name = "kilometrage_annuel", nullable = false)
    private Integer kilometrageAnnuel = 0;

    @Column(name = "description_apropos", columnDefinition = "TEXT")
    private String descriptionApropos;

    @Column(name = "equipements_json", columnDefinition = "TEXT")
    private String equipementsJson;

    @Column(name = "url_image", length = 500)
    private String urlImage;

    @Column(name = "derniere_latitude", precision = 10, scale = 7)
    private BigDecimal derniereLatitude;

    @Column(name = "derniere_longitude", precision = 10, scale = 7)
    private BigDecimal derniereLongitude;
}