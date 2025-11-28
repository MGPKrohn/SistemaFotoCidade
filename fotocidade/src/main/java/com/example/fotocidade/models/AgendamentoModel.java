package com.example.fotocidade.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "agendamento")
public class AgendamentoModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAgendamento;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate diaAgendamento;

    @Temporal(TemporalType.TIMESTAMP) // Anotação para garantir o formato correto no DB
    private LocalDateTime horaInicio; // Novo campo para início

    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime horaFim; // Novo campo para fim

    private String nomecliente;

    private Boolean situacaoPagamento;

    public AgendamentoModel(){}

    public AgendamentoModel(Long idAgendamento, LocalDate diaAgendamento, LocalDateTime horaInicio, LocalDateTime horaFim, String nomecliente, Boolean situacaoPagamento) {
        this.idAgendamento = idAgendamento;
        this.diaAgendamento = diaAgendamento;
        this.horaInicio = horaInicio;
        this.horaFim = horaFim;
        this.nomecliente = nomecliente;
        this.situacaoPagamento = situacaoPagamento;
    }

    public Long getIdAgendamento() {
        return idAgendamento;
    }

    public void setIdAgendamento(Long idAgendamento) {
        this.idAgendamento = idAgendamento;
    }

    public LocalDate getDiaAgendamento() {
        return diaAgendamento;
    }

    public void setDiaAgendamento(LocalDate diaAgendamento) {
        this.diaAgendamento = diaAgendamento;
    }

    public LocalDateTime getHoraInicio() {
        return horaInicio;
    }

    public void setHoraInicio(LocalDateTime horaInicio) {
        this.horaInicio = horaInicio;
    }

    public LocalDateTime getHoraFim() {
        return horaFim;
    }

    public void setHoraFim(LocalDateTime horaFim) {
        this.horaFim = horaFim;
    }

    public String getNomecliente() {
        return nomecliente;
    }

    public void setNomecliente(String nomecliente) {
        this.nomecliente = nomecliente;
    }

    public Boolean getSituacaoPagamento() {
        return situacaoPagamento;
    }

    public void setSituacaoPagamento(Boolean situacaoPagamento) {
        this.situacaoPagamento = situacaoPagamento;
    }
}
