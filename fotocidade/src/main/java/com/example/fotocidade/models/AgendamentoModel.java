package com.example.fotocidade.models;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "agendamento")
public class AgendamentoModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAgendamento;

    private Date diaAgendamento;

    private String nomecliente;

    private Boolean situacaoPagamento;

    public AgendamentoModel(Long idAgendamento, Date diaAgendamento, String nomecliente, Boolean situacaoPagamento) {
        this.idAgendamento = idAgendamento;
        this.diaAgendamento = diaAgendamento;
        this.nomecliente = nomecliente;
        this.situacaoPagamento = situacaoPagamento;
    }

    public Long getIdAgendamento() {
        return idAgendamento;
    }

    public void setIdAgendamento(Long idAgendamento) {
        this.idAgendamento = idAgendamento;
    }

    public Date getDiaAgendamento() {
        return diaAgendamento;
    }

    public void setDiaAgendamento(Date diaAgendamento) {
        this.diaAgendamento = diaAgendamento;
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
