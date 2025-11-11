package com.gabriel.api_estacao_meteorologica.service;

import com.gabriel.api_estacao_meteorologica.entity.Temperatura;
import com.gabriel.api_estacao_meteorologica.repository.TemperaturaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TemperaturaService {

    @Autowired
    private TemperaturaRepository temperaturaRepository;

    @Autowired
    private ArduinoService arduinoService;

    // ==================== Consultas ====================
    public List<Temperatura> getTemperaturaDiaria() {
        LocalDate hoje = LocalDate.now();
        LocalDateTime inicioDoDia = hoje.atStartOfDay();
        LocalDateTime fimDoDia = hoje.atTime(LocalTime.MAX);

        return temperaturaRepository.findByDataBetweenOrderByDataAsc(inicioDoDia, fimDoDia);
    }

    public List<Temperatura> getTemperaturaIntervalo(LocalDateTime inicio, LocalDateTime fim) {
        long dias = ChronoUnit.DAYS.between(inicio.toLocalDate(), fim.toLocalDate()) + 1;

        List<Temperatura> registros = temperaturaRepository.findByDataBetweenOrderByDataAsc(inicio, fim);

        if (dias <= 2) {
            return registros;
        }

        Map<LocalDate, Double> mediaPorDia = registros.stream()
                .collect(Collectors.groupingBy(
                        t -> t.getData().toLocalDate(),
                        Collectors.averagingDouble(Temperatura::getValor)
                ));

        return mediaPorDia.entrySet().stream()
                .map(e -> {
                    Temperatura t = new Temperatura();
                    t.setData(e.getKey().atStartOfDay());
                    t.setValor(e.getValue());
                    return t;
                })
                .sorted((a, b) -> a.getData().compareTo(b.getData()))
                .toList();
    }

    // ==================== Agendamento ====================
    @Scheduled(cron = "0 0,30 * * * *") // Executa no minuto 0 e 30 de cada hora
    public void salvarTemperaturaAgendada() {
        try {
            double tempAtual = arduinoService.getUltimaLeitura().getTemperatura();

            if (Double.isNaN(tempAtual)) {
                System.out.println("⚠️ Temperatura inválida, não será salva");
                return;
            }

            LocalDateTime agora = LocalDateTime.now().truncatedTo(ChronoUnit.MINUTES);

            Temperatura temperatura = new Temperatura();
            temperatura.setValor(tempAtual);
            temperatura.setData(agora);

            temperaturaRepository.save(temperatura);

            System.out.println("✅ Temperatura salva: " + tempAtual + " °C em " + agora);
        } catch (Exception e) {
            System.err.println("⚠️ Erro ao salvar temperatura: " + e.getMessage());
        }
    }
}
