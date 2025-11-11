package com.gabriel.api_estacao_meteorologica.resource;

import com.gabriel.api_estacao_meteorologica.entity.SensorData;
import com.gabriel.api_estacao_meteorologica.service.ArduinoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/dadosArduino")
public class ArduinoResource {

    @Autowired
    private ArduinoService arduinoService;

    @GetMapping
    public SensorData getUltimaLeitura() {
        return arduinoService.getUltimaLeitura();
    }
}