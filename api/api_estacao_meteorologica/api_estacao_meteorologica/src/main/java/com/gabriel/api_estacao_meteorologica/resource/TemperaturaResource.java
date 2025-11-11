package com.gabriel.api_estacao_meteorologica.resource;

import com.gabriel.api_estacao_meteorologica.entity.Temperatura;
import com.gabriel.api_estacao_meteorologica.service.TemperaturaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping(path = "/temperatura")
public class TemperaturaResource {
    @Autowired
    private TemperaturaService temperaturaService;

    @GetMapping("/diario")
    public ResponseEntity<List<Temperatura>> getTemperaturaDiaria() {
        return ResponseEntity.ok(temperaturaService.getTemperaturaDiaria());
    }

    @GetMapping("/intervalo")
    public ResponseEntity<List<Temperatura>> getTemperaturaIntervalo(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataFinal
    ) {
        return ResponseEntity.ok(temperaturaService.getTemperaturaIntervalo(dataInicio, dataFinal));
    }
}