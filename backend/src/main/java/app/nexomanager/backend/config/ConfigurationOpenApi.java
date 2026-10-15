// ConfigurationOpenApi.java
package app.nexomanager.backend.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ConfigurationOpenApi {

    @Bean
    public OpenAPI apiNexoManager() {
        final String nomSchema = "AuthentificationBearer";
        return new OpenAPI()
                .info(new Info()
                        .title("API NexoManager.app (ERP Interne)")
                        .version("1.0.0")
                        .description("API REST & WebSocket STOMP en français pour la gestion interne de location de voitures"))
                .addSecurityItem(new SecurityRequirement().addList(nomSchema))
                .components(new Components().addSecuritySchemes(nomSchema, new SecurityScheme()
                        .name(nomSchema)
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")));
    }
}