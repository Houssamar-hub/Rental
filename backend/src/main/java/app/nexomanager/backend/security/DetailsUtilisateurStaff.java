// DetailsUtilisateurStaff.java
package app.nexomanager.backend.security;

import app.nexomanager.backend.domain.entity.UtilisateurStaff;
import app.nexomanager.backend.domain.enums.RoleStaff;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Getter
public class DetailsUtilisateurStaff implements UserDetails {

    private final Long id;
    private final String nomComplet;
    private final String email;
    private final String motDePasse;
    private final RoleStaff role;
    private final boolean actif;

    public DetailsUtilisateurStaff(UtilisateurStaff utilisateur) {
        this.id = utilisateur.getId();
        this.nomComplet = utilisateur.getNomComplet();
        this.email = utilisateur.getEmail();
        this.motDePasse = utilisateur.getMotDePasseHash();
        this.role = utilisateur.getRole();
        this.actif = utilisateur.isActif();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override public String getPassword() { return motDePasse; }
    @Override public String getUsername() { return email; }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return actif; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return actif; }
}