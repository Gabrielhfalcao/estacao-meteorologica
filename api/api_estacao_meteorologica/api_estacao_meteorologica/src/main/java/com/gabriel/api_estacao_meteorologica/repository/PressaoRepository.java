package com.gabriel.api_estacao_meteorologica.repository;

import com.gabriel.api_estacao_meteorologica.entity.Pressao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface PressaoRepository extends JpaRepository<Pressao, Integer> {

    List<Pressao> findByDataBetweenOrderByDataAsc(LocalDateTime inicio, LocalDateTime fim);

}
