package com.gabriel.api_estacao_meteorologica.service;

import com.gabriel.api_estacao_meteorologica.entity.Temperatura;
import com.gabriel.api_estacao_meteorologica.entity.Umidade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import com.gabriel.api_estacao_meteorologica.repository.UmidadeRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class UmidadeService {

    @Autowired
    private UmidadeRepository umidadeRepository;

    @Autowired
    private ArduinoService arduinoService;

    // ==================== Consultas ====================
    public List<Umidade> getUmidadeDiaria() {
        LocalDate hoje = LocalDate.now();
        LocalDateTime inicioDoDia = hoje.atStartOfDay();
        LocalDateTime fimDoDia = hoje.atTime(LocalTime.MAX);

        return umidadeRepository.findByDataBetweenOrderByDataAsc(inicioDoDia, fimDoDia);
    }

    public List<Umidade> getUmidadeIntervalo(LocalDateTime inicio, LocalDateTime fim) {
        return umidadeRepository.findByDataBetweenOrderByDataAsc(inicio, fim);
    }

    // ==================== Agendamento ====================
    @Scheduled(cron = "0 0,30 * * * *") // Executa no minuto 0 e 30 de cada hora
    public void salvarUmidadeAgendada() {
        try {
            double umidadeAtual = arduinoService.getUltimaLeitura().getUmidade();

            if (Double.isNaN(umidadeAtual)) {
                System.out.println("⚠️ Umidade inválida, não será salva");
                return;
            }

            LocalDateTime agora = LocalDateTime.now().truncatedTo(ChronoUnit.MINUTES);

            Umidade umidade = new Umidade();
            umidade.setValor(umidadeAtual);
            umidade.setData(agora);

            umidadeRepository.save(umidade);

            System.out.println("✅ Umidade salva: " + umidadeAtual + " % em " + agora);
        } catch (Exception e) {
            System.err.println("⚠️ Erro ao salvar umidade: " + e.getMessage());
        }
    }
}