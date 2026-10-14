package app.nexomanager.backend.service;

import app.nexomanager.backend.domain.entity.Chauffeur;
import app.nexomanager.backend.domain.entity.Client;
import app.nexomanager.backend.domain.entity.Facture;
import app.nexomanager.backend.domain.entity.Reservation;
import app.nexomanager.backend.domain.entity.Vehicule;
import app.nexomanager.backend.domain.enums.StatutFacture;
import app.nexomanager.backend.domain.enums.StatutPaiement;
import app.nexomanager.backend.domain.enums.StatutReservation;
import app.nexomanager.backend.domain.enums.StatutVehicule;
import app.nexomanager.backend.dto.DtosReservation.EvenementCalendrierDto;
import app.nexomanager.backend.dto.DtosReservation.RequeteCreationReservation;
import app.nexomanager.backend.exception.ExceptionMetier;
import app.nexomanager.backend.exception.ExceptionRessourceIntrouvable;
import app.nexomanager.backend.repository.ChauffeurRepository;
import app.nexomanager.backend.repository.ClientRepository;
import app.nexomanager.backend.repository.FactureRepository;
import app.nexomanager.backend.repository.ReservationRepository;
import app.nexomanager.backend.repository.VehiculeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ServiceReservation {

    private final ReservationRepository reservationRepository;
    private final VehiculeRepository vehiculeRepository;
    private final ClientRepository clientRepository;
    private final ChauffeurRepository chauffeurRepository;
    private final FactureRepository factureRepository;

    @Transactional(readOnly = true)
    public List<Reservation> listerReservations() {
        return reservationRepository.findAll();
    }

    @Transactional
    public Reservation creerReservation(RequeteCreationReservation requete) {
        if (!requete.dateHeureFin().isAfter(requete.dateHeureDebut())) {
            throw new ExceptionMetier("La date de retour doit être postérieure à la date de départ.");
        }

        // Verrouillage pessimiste pour éviter toute double réservation simultanée
        Vehicule vehicule = vehiculeRepository.findByIdAvecVerrou(requete.vehiculeId())
                .orElseThrow(() -> new ExceptionRessourceIntrouvable("Véhicule introuvable."));

        if (vehicule.getStatut() == StatutVehicule.MAINTENANCE || vehicule.getStatut() == StatutVehicule.INDISPONIBLE) {
            throw new ExceptionMetier("Ce véhicule est actuellement en maintenance ou indisponible.");
        }

        if (reservationRepository.existeChevauchementReservation(
                vehicule.getId(), requete.dateHeureDebut(), requete.dateHeureFin())) {
            throw new ExceptionMetier("Conflit de planning : ce véhicule est déjà réservé sur ce créneau.");
        }

        Client client = clientRepository.findById(requete.clientId())
                .orElseThrow(() -> new ExceptionRessourceIntrouvable("Client introuvable."));

        Chauffeur chauffeur = null;
        if (requete.chauffeurId() != null) {
            chauffeur = chauffeurRepository.findById(requete.chauffeurId())
                    .orElseThrow(() -> new ExceptionRessourceIntrouvable("Chauffeur introuvable."));
        }

        long jours = Math.max(1, Duration.between(requete.dateHeureDebut(), requete.dateHeureFin()).toDays());
        BigDecimal montantTotal = vehicule.getTarifJournalier().multiply(BigDecimal.valueOf(jours));
        String codeUnique = "RES-NX" + UUID.randomUUID().toString().substring(0, 5).toUpperCase();

        StatutPaiement statutPaiement = requete.statutPaiement() != null
                ? requete.statutPaiement()
                : StatutPaiement.EN_ATTENTE;

        Reservation reservation = Reservation.builder()
                .codeReservation(codeUnique)
                .dateReservation(LocalDate.now())
                .client(client)
                .vehicule(vehicule)
                .chauffeur(chauffeur)
                .dureeJours((int) jours)
                .dateHeureDebut(requete.dateHeureDebut())
                .dateHeureFin(requete.dateHeureFin())
                .montantTotal(montantTotal)
                .statutPaiement(statutPaiement)
                .statut(StatutReservation.EN_COURS)
                .notes(requete.notes())
                .build();

        Reservation sauvegarde = reservationRepository.save(reservation);

        // Génération automatique de la facture associée dans le module Financials -> Payments
        Facture facture = Facture.builder()
                .codeFacture("FAC-" + codeUnique.substring(4))
                .reservation(sauvegarde)
                .client(client)
                .vehicule(vehicule)
                .tarifJournalier(vehicule.getTarifJournalier())
                .dureeJours((int) jours)
                .montant(montantTotal)
                .dateEcheance(LocalDate.ofInstant(requete.dateHeureFin(), ZoneId.of("Africa/Casablanca")))
                .statut(statutPaiement == StatutPaiement.PAYE ? StatutFacture.COMPLETEE : StatutFacture.EN_ATTENTE)
                .build();
        factureRepository.save(facture);

        return sauvegarde;
    }

    @Transactional
    public Reservation changerStatutReservation(Long id, StatutReservation nouveauStatut) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ExceptionRessourceIntrouvable("Réservation introuvable : " + id));
        reservation.setStatut(nouveauStatut);
        return reservationRepository.save(reservation);
    }

    /**
     * Alimente la grille du module "Calendar" (événements Départ / Retour).
     */
    @Transactional(readOnly = true)
    public List<EvenementCalendrierDto> obtenirEvenementsCalendrier() {
        List<EvenementCalendrierDto> evenements = new ArrayList<>();
        for (Reservation r : reservationRepository.findAll()) {
            if (r.getStatut() == StatutReservation.ANNULEE) {
                continue;
            }
            String nomChauffeur = r.getChauffeur() != null ? r.getChauffeur().getNomComplet() : "Aucun";
            String modele = r.getVehicule().getMarque() + " " + r.getVehicule().getModele();

            evenements.add(EvenementCalendrierDto.builder()
                    .reservationId(r.getId())
                    .codeReservation(r.getCodeReservation())
                    .typeEvenement("DEPART")
                    .dateHeure(r.getDateHeureDebut())
                    .nomClient(r.getClient().getNomComplet())
                    .nomChauffeur(nomChauffeur)
                    .modeleVehicule(modele)
                    .codeVehicule(r.getVehicule().getCodeVehicule())
                    .notes(r.getNotes())
                    .build());

            evenements.add(EvenementCalendrierDto.builder()
                    .reservationId(r.getId())
                    .codeReservation(r.getCodeReservation())
                    .typeEvenement("RETOUR")
                    .dateHeure(r.getDateHeureFin())
                    .nomClient(r.getClient().getNomComplet())
                    .nomChauffeur(nomChauffeur)
                    .modeleVehicule(modele)
                    .codeVehicule(r.getVehicule().getCodeVehicule())
                    .notes(r.getNotes())
                    .build());
        }
        return evenements;
    }
}