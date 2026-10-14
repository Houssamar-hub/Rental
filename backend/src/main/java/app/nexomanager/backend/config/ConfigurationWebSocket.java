// ConfigurationWebSocket.java
package app.nexomanager.backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class ConfigurationWebSocket implements WebSocketMessageBrokerConfigurer {

    private final IntercepteurWebSocketJwt intercepteurJwt;

    @Value("${nexomanager.cors.allowed-origins}")
    private String originesAutorisees;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registre) {
        registre.enableSimpleBroker("/topic", "/queue");
        registre.setApplicationDestinationPrefixes("/app");
        registre.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registre) {
        registre.addEndpoint("/ws")
                .setAllowedOrigins(originesAutorisees.split(","))
                .withSockJS();
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration enregistrement) {
        enregistrement.interceptors(intercepteurJwt);
    }
}