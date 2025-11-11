package com.gabriel.api_estacao_meteorologica.resource;

import com.gabriel.api_estacao_meteorologica.entity.Pressao;
import com.gabriel.api_estacao_meteorologica.service.PressaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/pressao")
public class PressaoResource {

    @Autowired
    private PressaoService pressaoService;

    @GetMapping("/diario")
    public ResponseEntity<List<Pressao>> getPressaoDiaria() {
        return ResponseEntity.ok(pressaoService.getPressaoDiaria());
    }

    @GetMapping("/intervalo")
    public ResponseEntity<List<Pressao>> getPressaoIntervalo(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataFinal
    ) {
        return ResponseEntity.ok(pressaoService.getPressaoIntervalo(dataInicio, dataFinal));
    }
}
