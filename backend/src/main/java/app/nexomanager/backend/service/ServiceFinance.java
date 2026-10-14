// ServiceFinance.java
package app.nexomanager.backend.service;

import app.nexomanager.backend.domain.entity.Depense;
import app.nexomanager.backend.domain.entity.Facture;
import app.nexomanager.backend.domain.enums.CategorieDepense;
import app.nexomanager.backend.domain.enums.StatutFacture;
import app.nexomanager.backend.dto.DtosFinance.ResumeDepensesDto;
import app.nexomanager.backend.dto.DtosFinance.ResumePaiementsDto;
import app.nexomanager.backend.repository.DepenseRepository;
import app.nexomanager.backend.repository.FactureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ServiceFinance {

    private final FactureRepository factureRepository;
    private final DepenseRepository depenseRepository;

    @Transactional(readOnly = true)
    public ResumePaiementsDto obtenirResumePaiements() {
        return ResumePaiementsDto.builder()
                .montantComplete(factureRepository.calculerSommeParStatut(StatutFacture.COMPLETEE))
                .montantEnAttente(factureRepository.calculerSommeParStatut(StatutFacture.EN_ATTENTE))
                .montantEnRetard(factureRepository.calculerSommeParStatut(StatutFacture.EN_RETARD))
                .factures(factureRepository.findAll())
                .build();
    }

    @Transactional(readOnly = true)
    public ResumeDepensesDto obtenirResumeDepenses() {
        BigDecimal revenus = factureRepository.calculerSommeParStatut(StatutFacture.COMPLETEE);
        BigDecimal depenses = depenseRepository.calculerTotalDepensesCompletees();
        List<Depense> toutesDepenses = depenseRepository.findAll();

        Map<String, BigDecimal> parCategorie = new LinkedHashMap<>();
        for (CategorieDepense cat : CategorieDepense.values()) {
            BigDecimal somme = toutesDepenses.stream()
                    .filter(d -> d.getCategorie() == cat)
                    .map(Depense::getMontant)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            parCategorie.put(cat.name(), somme);
        }

        return ResumeDepensesDto.builder()
                .soldeNet(revenus.subtract(depenses))
                .totalRevenus(revenus)
                .totalDepenses(depenses)
                .repartitionParCategorie(parCategorie)
                .transactionsRecentes(toutesDepenses)
                .build();
    }

    @Transactional
    public Depense ajouterDepense(Depense depense) {
        return depenseRepository.save(depense);
    }

    @Transactional
    public Facture creerFacture(Facture facture) {
        return factureRepository.save(facture);
    }
}