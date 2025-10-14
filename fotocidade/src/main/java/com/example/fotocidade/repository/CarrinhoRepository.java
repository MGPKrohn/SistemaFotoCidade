package com.example.fotocidade.repository;

import com.example.fotocidade.models.CarrinhoModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CarrinhoRepository extends JpaRepository<CarrinhoModel, Long> {
    //IMPORTANTE adicionar metodos de busca por carrinhos abertos e fechados
}
