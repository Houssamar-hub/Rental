// IntercepteurWebSocketJwt.java
package app.nexomanager.backend.config;

import app.nexomanager.backend.security.ServiceDetailsUtilisateurStaff;
import app.nexomanager.backend.security.ServiceJwt;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessagingException;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class IntercepteurWebSocketJwt implements ChannelInterceptor {

    private final ServiceJwt serviceJwt;
    private final ServiceDetailsUtilisateurStaff serviceDetailsUtilisateur;

    @Override
    public Message<?> preSend(@NonNull Message<?> message, @NonNull MessageChannel canal) {
        StompHeaderAccessor accesseur = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        if (accesseur != null && StompCommand.CONNECT.equals(accesseur.getCommand())) {
            String enteteAuth = accesseur.getFirstNativeHeader("Authorization");
            if (enteteAuth == null || !enteteAuth.startsWith("Bearer ")) {
                throw new MessagingException("Jeton JWT obligatoire pour la connexion WebSocket NexoManager.");
            }
            String jeton = enteteAuth.substring(7);
            String email = serviceJwt.extraireEmail(jeton);
            UserDetails details = serviceDetailsUtilisateur.loadUserByUsername(email);
            if (!serviceJwt.estJetonValide(jeton, details)) {
                throw new MessagingException("Jeton JWT WebSocket invalide ou expiré.");
            }
            accesseur.setUser(new UsernamePasswordAuthenticationToken(details, null, details.getAuthorities()));
        }
        return message;
    }
}