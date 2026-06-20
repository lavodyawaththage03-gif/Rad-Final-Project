package com.meditrack.meditrack_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MeditrackBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(MeditrackBackendApplication.class, args);
	}

}
