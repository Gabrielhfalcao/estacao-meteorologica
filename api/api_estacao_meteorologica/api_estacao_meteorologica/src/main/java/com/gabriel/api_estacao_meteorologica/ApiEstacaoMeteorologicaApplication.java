package com.gabriel.api_estacao_meteorologica;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ApiEstacaoMeteorologicaApplication {

	public static void main(String[] args) {
		SpringApplication.run(ApiEstacaoMeteorologicaApplication.class, args);
	}

}
