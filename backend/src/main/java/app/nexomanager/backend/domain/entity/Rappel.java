// Rappel.java
package app.nexomanager.backend.domain.entity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "rappels")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Rappel extends EntiteBase {

    @Column(nullable = false, length = 200)
    private String titre;

    @Column(name = "date_rappel", nullable = false)
    private LocalDate dateRappel;

    @Column(name = "heure_rappel", length = 20)
    private String heureRappel;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "vehicule_id")
    private Vehicule vehicule;

    @Builder.Default
    @Column(nullable = false)
    private boolean termine = false;
}