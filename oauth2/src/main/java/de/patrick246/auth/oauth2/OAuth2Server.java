package de.patrick246.auth.oauth2;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.web.bind.annotation.GetMapping;

import java.security.Principal;

@SpringBootApplication
@EnableResourceServer
public class OAuth2Server {

    @GetMapping("/user")
    public Principal getUser(Principal principal) {
        return principal;
    }

    public static void main(String[] args) {
        SpringApplication.run(OAuth2Server.class, args);
    }
}
