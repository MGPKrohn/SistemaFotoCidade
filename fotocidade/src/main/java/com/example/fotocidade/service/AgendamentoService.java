package com.example.fotocidade.service;

import com.example.fotocidade.models.AgendamentoModel;
import com.example.fotocidade.repository.AgendamentoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class AgendamentoService {

    @Autowired
    private AgendamentoRepository agendamentoRepository;


    @Transactional
    public AgendamentoModel salvarAgendamento(AgendamentoModel agendamento) {

        // 1. Validação de conflito de horário
        agendamentoRepository.findConflictingAppointment(
                        agendamento.getHoraInicio(),
                        agendamento.getHoraFim())
                .ifPresent(conflito -> {
                    throw new RuntimeException("Conflito de horário! O período de "
                            + agendamento.getHoraInicio() + " a " + agendamento.getHoraFim()
                            + " se sobrepõe ao agendamento existente de ID: " + conflito.getIdAgendamento());
                });

        // 2. Salva o agendamento se não houver conflito
        return agendamentoRepository.save(agendamento);
    }

    // --- Funções de Consulta (GET) ---

    public List<AgendamentoModel> listarTodos() {
        return agendamentoRepository.findAll();
    }

    public AgendamentoModel buscarPorId(Long id) {
        return agendamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado com o ID: " + id));
    }


}