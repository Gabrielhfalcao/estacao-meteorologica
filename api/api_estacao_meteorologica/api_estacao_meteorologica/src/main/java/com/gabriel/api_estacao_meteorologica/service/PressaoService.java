package com.gabriel.api_estacao_meteorologica.service;

import com.gabriel.api_estacao_meteorologica.entity.Pressao;
import com.gabriel.api_estacao_meteorologica.repository.PressaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class PressaoService {

    @Autowired
    private PressaoRepository pressaoRepository;

    @Autowired
    private ArduinoService arduinoService;

    // ==================== Consultas ====================
    public List<Pressao> getPressaoDiaria() {
        LocalDate hoje = LocalDate.now();
        LocalDateTime inicioDoDia = hoje.atStartOfDay();
        LocalDateTime fimDoDia = hoje.atTime(LocalTime.MAX);

        return pressaoRepository.findByDataBetweenOrderByDataAsc(inicioDoDia, fimDoDia);
    }

    public List<Pressao> getPressaoIntervalo(LocalDateTime inicio, LocalDateTime fim) {
        return pressaoRepository.findByDataBetweenOrderByDataAsc(inicio, fim);
    }

    // ==================== Agendamento ====================
    @Scheduled(cron = "0 0,30 * * * *") // Executa no minuto 0 e 30 de cada hora
    public void salvarPressaoAgendada() {
        try {
            double pressaoAtual = arduinoService.getUltimaLeitura().getPressao();

            if (Double.isNaN(pressaoAtual)) {
                System.out.println("⚠️ Pressão inválida, não será salva");
                return;
            }

            LocalDateTime agora = LocalDateTime.now().truncatedTo(ChronoUnit.MINUTES);

            Pressao pressao = new Pressao();
            pressao.setValor(pressaoAtual);
            pressao.setData(agora);

            pressaoRepository.save(pressao);

            System.out.println("✅ Pressão salva: " + pressaoAtual + " hPa em " + agora);
        } catch (Exception e) {
            System.err.println("⚠️ Erro ao salvar pressão: " + e.getMessage());
        }
    }
}
