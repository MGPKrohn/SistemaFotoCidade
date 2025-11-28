package com.example.fotocidade.repository;

import com.example.fotocidade.models.AgendamentoModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AgendamentoRepository extends JpaRepository<AgendamentoModel, Long> {
    @Query("SELECT a FROM AgendamentoModel a WHERE " +
            // 1. O novo agendamento começa antes do fim e termina depois do início de um existente
            "(:novaHoraFim > a.horaInicio AND :novaHoraInicio < a.horaFim)")
    Optional<AgendamentoModel> findConflictingAppointment(
            @Param("novaHoraInicio") LocalDateTime novaHoraInicio,
            @Param("novaHoraFim") LocalDateTime novaHoraFim
    );

    List<AgendamentoModel> findAllByOrderByDiaAgendamentoAscHoraInicioAsc();

    List<AgendamentoModel> findByDiaAgendamentoOrderByHoraInicioAsc(LocalDate dataAgendamento);

    @Query("SELECT DISTINCT a.diaAgendamento FROM AgendamentoModel a")
    List<LocalDate> findDistinctDiaAgendamento();
}
