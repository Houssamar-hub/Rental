// Depense.java
package app.nexomanager.backend.domain.entity;

import app.nexomanager.backend.domain.enums.CategorieDepense;
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
import java.time.LocalDate;

@Entity
@Table(name = "depenses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Depense extends EntiteBase {

    @Column(nullable = false, length = 150)
    private String intitule;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private CategorieDepense categorie;

    @Builder.Default
    @Column(nullable = false)
    private Integer quantite = 1;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal montant;

    @Column(name = "date_depense", nullable = false)
    private LocalDate dateDepense;

    @Builder.Default
    @Column(nullable = false, length = 20)
    private String statut = "COMPLETEE";

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "vehicule_id")
    private Vehicule vehicule;
}