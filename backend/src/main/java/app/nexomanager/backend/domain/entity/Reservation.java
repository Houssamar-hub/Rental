package app.nexomanager.backend.domain.entity;

import app.nexomanager.backend.domain.enums.StatutPaiement;
import app.nexomanager.backend.domain.enums.StatutReservation;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "reservations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reservation extends EntiteBase {

    @Column(name = "code_reservation", nullable = false, unique = true, length = 30)
    private String codeReservation;

    @Column(name = "date_reservation", nullable = false)
    private LocalDate dateReservation;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "vehicule_id", nullable = false)
    private Vehicule vehicule;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "chauffeur_id")
    private Chauffeur chauffeur;

    @Column(name = "duree_jours", nullable = false)
    private Integer dureeJours;

    @Column(name = "date_heure_debut", nullable = false)
    private Instant dateHeureDebut;

    @Column(name = "date_heure_fin", nullable = false)
    private Instant dateHeureFin;

    @Column(name = "montant_total", nullable = false, precision = 10, scale = 2)
    private BigDecimal montantTotal;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(name = "statut_paiement", nullable = false, length = 20)
    private StatutPaiement statutPaiement = StatutPaiement.EN_ATTENTE;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false, length = 20)
    private StatutReservation statut = StatutReservation.EN_COURS;

    @Column(length = 500)
    private String notes;

    @Builder.Default
    @Column(name = "distance_trajet_km", precision = 8, scale = 2)
    private BigDecimal distanceTrajetKm = BigDecimal.ZERO;
}