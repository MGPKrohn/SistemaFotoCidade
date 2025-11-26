package com.example.fotocidade.repository;


import com.example.fotocidade.models.CarrinhoItemId;
import com.example.fotocidade.models.CarrinhoItemModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarrinhoItemRepository extends JpaRepository<CarrinhoItemModel, CarrinhoItemId> {

    List<CarrinhoItemModel> findByCarrinho_IdCarrinho(Long idCarrinho);


}
