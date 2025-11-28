// src/main/java/com/example/fotocidade/controller/AgendamentoController.java

package com.example.fotocidade.controller;

import com.example.fotocidade.models.AgendamentoModel;
import com.example.fotocidade.repository.AgendamentoRepository;
import com.example.fotocidade.service.AgendamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/agendamento")
public class AgendamentoController {

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @Autowired
    private AgendamentoService agendamentoService;

    // Formato de data padrão que o React/Frontend envia (YYYY-MM-DD)
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");


    // =========================================================
    // POST /agendamento: Cria um novo agendamento
    // =========================================================
    @PostMapping
    public ResponseEntity<AgendamentoModel> criarAgendamento(@RequestBody AgendamentoModel agendamento) {
        if (agendamento.getDiaAgendamento() == null || agendamento.getNomecliente() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        AgendamentoModel novoAgendamento = agendamentoRepository.save(agendamento);
        return new ResponseEntity<>(novoAgendamento, HttpStatus.CREATED);
    }

    // =========================================================
    // GET /agendamento/datas: Lista todas as datas ÚNICAS agendadas
    // =========================================================
    @GetMapping("/datas")
    public ResponseEntity<Set<String>> listarDatasAgendadas() {
        // Busca a lista de LocalDate do Repositório
        List<LocalDate> datas = agendamentoRepository.findDistinctDiaAgendamento();

        // Formata cada LocalDate para String (YYYY-MM-DD)
        Set<String> datasUnicasFormatadas = datas.stream()
                .map(date -> date.format(DATE_FORMATTER))
                .collect(Collectors.toSet());

        // Agora o Service do Frontend recebe um Set<String> limpo e fácil de consumir.
        return ResponseEntity.ok(datasUnicasFormatadas);
    }

    // =========================================================
    // GET /agendamento/data/{data}: Lista agendamentos para um dia
    // =========================================================
    @GetMapping("/data/{data}")
    public ResponseEntity<List<AgendamentoModel>> listarAgendamentosPorData(@PathVariable String data) {
        try {
            // 1. Converte a string YYYY-MM-DD (do frontend) diretamente para LocalDate
            LocalDate dia = LocalDate.parse(data, DATE_FORMATTER);

            // 2. Busca agendamentos usando o método simples do Repositório
            List<AgendamentoModel> agendamentos = agendamentoRepository.findByDiaAgendamentoOrderByHoraInicioAsc(dia);

            return ResponseEntity.ok(agendamentos);

        } catch (Exception e) {
            // Retorna erro 400 se a data não estiver no formato correto
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping

    public ResponseEntity<List<AgendamentoModel>> listarTodos() {

        List<AgendamentoModel> agendamentos = agendamentoService.listarTodos();

        return ResponseEntity.ok(agendamentos);

    }

}