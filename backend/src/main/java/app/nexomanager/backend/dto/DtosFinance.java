// DtosFinance.java
package app.nexomanager.backend.dto;

import app.nexomanager.backend.domain.entity.Depense;
import app.nexomanager.backend.domain.entity.Facture;
import lombok.Builder;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class DtosFinance {

    @Builder
    public record ResumePaiementsDto(
            BigDecimal montantComplete,
            BigDecimal montantEnAttente,
            BigDecimal montantEnRetard,
            List<Facture> factures
    ) {}

    @Builder
    public record ResumeDepensesDto(
            BigDecimal soldeNet,
            BigDecimal totalRevenus,
            BigDecimal totalDepenses,
            Map<String, BigDecimal> repartitionParCategorie,
            List<Depense> transactionsRecentes
    ) {}
}