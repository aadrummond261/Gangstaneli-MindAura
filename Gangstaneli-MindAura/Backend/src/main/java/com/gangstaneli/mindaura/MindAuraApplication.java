package com.gangstaneli.mindaura;


import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;

@SpringBootApplication
public class MindAuraApplication {
    public static void main(String[] args) {
        new SpringApplicationBuilder(MindAuraApplication.class)
                .initializers(new SqliteDataDirectoryInitializer())
                .run(args);
    }
}
