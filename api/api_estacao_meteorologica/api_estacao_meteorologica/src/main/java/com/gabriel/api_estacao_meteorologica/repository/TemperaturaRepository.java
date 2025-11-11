package com.gabriel.api_estacao_meteorologica.repository;

import com.gabriel.api_estacao_meteorologica.entity.Temperatura;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface TemperaturaRepository extends JpaRepository<Temperatura, Integer> {
    List<Temperatura> findByDataBetweenOrderByDataAsc(LocalDateTime inicio, LocalDateTime fim);
}
