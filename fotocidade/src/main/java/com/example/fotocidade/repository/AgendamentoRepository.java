package com.example.fotocidade.repository;

import com.example.fotocidade.models.AgendamentoModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AgendamentoRepository extends JpaRepository<AgendamentoModel, Long> {
    //Importante voltar para implementar algumas funções sobre agendamento como um findBy
}
