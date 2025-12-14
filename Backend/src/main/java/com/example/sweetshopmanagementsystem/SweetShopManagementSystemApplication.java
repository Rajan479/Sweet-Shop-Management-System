package com.example.sweetshopmanagementsystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class SweetShopManagementSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(SweetShopManagementSystemApplication.class, args);
    }

}
