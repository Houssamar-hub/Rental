// ServiceDetailsUtilisateurStaff.java
package app.nexomanager.backend.security;

import app.nexomanager.backend.repository.UtilisateurStaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ServiceDetailsUtilisateurStaff implements UserDetailsService {

    private final UtilisateurStaffRepository utilisateurStaffRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return utilisateurStaffRepository.findByEmailIgnoreCaseAndActifTrue(email)
                .map(DetailsUtilisateurStaff::new)
                .orElseThrow(() -> new UsernameNotFoundException("Collaborateur introuvable : " + email));
    }
}