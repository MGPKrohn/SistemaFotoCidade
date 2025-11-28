package com.example.fotocidade.repository;

import com.example.fotocidade.models.EstoqueModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;
import java.util.Optional;

@Repository
@CrossOrigin("*")
public interface EstoqueRepository extends JpaRepository<EstoqueModel, Long> {
    @Query("SELECT e FROM EstoqueModel e WHERE e.quantidade > 0 AND e.quantidade IS NOT NULL")
    List<EstoqueModel> findAvailableStock();

    // --- NOVO MÉTODO ---
    // Busca por nome ignorando maiúsculas/minúsculas
    Optional<EstoqueModel> findByNomeProdIgnoreCase(String nomeProd);
}
