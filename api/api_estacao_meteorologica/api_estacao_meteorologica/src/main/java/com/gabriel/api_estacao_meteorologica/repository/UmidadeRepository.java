package com.gabriel.api_estacao_meteorologica.repository;

import com.gabriel.api_estacao_meteorologica.entity.Umidade;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface UmidadeRepository extends JpaRepository<Umidade, Integer> {
    List<Umidade> findByDataBetweenOrderByDataAsc(LocalDateTime inicio, LocalDateTime fim);
}
