// MessageChat.java
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

@Entity
@Table(name = "messages_chat")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageChat extends EntiteBase {

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @Column(name = "type_expediteur", nullable = false, length = 20)
    private String typeExpediteur; // STAFF ou CLIENT

    @Column(name = "nom_expediteur", nullable = false, length = 120)
    private String nomExpediteur;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String contenu;

    @Column(name = "url_piece_jointe", length = 500)
    private String urlPieceJointe;

    @Builder.Default
    @Column(nullable = false)
    private boolean lu = false;
}