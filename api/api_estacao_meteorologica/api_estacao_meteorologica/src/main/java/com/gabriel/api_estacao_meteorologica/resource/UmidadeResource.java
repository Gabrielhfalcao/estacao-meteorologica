package com.gabriel.api_estacao_meteorologica.resource;

import com.gabriel.api_estacao_meteorologica.entity.Temperatura;
import com.gabriel.api_estacao_meteorologica.entity.Umidade;
import com.gabriel.api_estacao_meteorologica.service.TemperaturaService;
import com.gabriel.api_estacao_meteorologica.service.UmidadeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping(path = "/umidade")
public class UmidadeResource {
    @Autowired
    private UmidadeService umidadeService;

    @GetMapping("/diario")
    public ResponseEntity<List<Umidade>> getUmidadeDiaria() {
        return ResponseEntity.ok(umidadeService.getUmidadeDiaria());
    }

    @GetMapping("/intervalo")
    public ResponseEntity<List<Umidade>> getUmidadeIntervalo(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataFinal
    ) {
        return ResponseEntity.ok(umidadeService.getUmidadeIntervalo(dataInicio, dataFinal));
    }
}
