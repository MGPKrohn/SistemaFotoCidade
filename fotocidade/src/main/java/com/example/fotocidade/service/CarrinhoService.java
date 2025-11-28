package com.example.fotocidade.service;

import com.example.fotocidade.models.*;
import com.example.fotocidade.repository.*;
import jakarta.transaction.Transactional; // Importante: usar jakarta, não javax
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Optional;

@Service
public class CarrinhoService {

    @Autowired
    private CarrinhoRepository carrinhoRepository;

    @Autowired
    private EstoqueRepository estoqueRepository;


    @Autowired
    private CarrinhoItemRepository carrinhoItemRepository;

    // 1. Cria um carrinho novo e vazio
    public CarrinhoModel criarCarrinho() {
        CarrinhoModel carrinho = new CarrinhoModel();
        carrinho.setPrecototal(BigDecimal.ZERO);
        carrinho.setItens(new ArrayList<>());
        return carrinhoRepository.save(carrinho);
    }

    // 2. Adiciona item ou Soma quantidade se já existir

    @Transactional
    public CarrinhoModel adicionarItem(Long idCarrinho, Long idEstoque, BigDecimal quantidade) {
        CarrinhoModel carrinho = carrinhoRepository.findById(idCarrinho)
                .orElseThrow(() -> new RuntimeException("Carrinho não encontrado!"));

        EstoqueModel produto = estoqueRepository.findById(idEstoque)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado!"));

        // ------------------ NOVO CÓDIGO DE CONTROLE DE ESTOQUE ------------------

        // 1. VERIFICA SE HÁ ESTOQUE SUFICIENTE
        // Nota: Assumimos que o EstoqueModel tem o campo 'quantidade' como BigDecimal.
        // Se a quantidade em estoque for menor que a quantidade pedida (compareTo < 0), lança exceção.
        if (produto.getQuantidade().compareTo(quantidade) < 0) {
            throw new RuntimeException("Estoque insuficiente. Apenas "
                    + produto.getQuantidade() + " unidades disponíveis para " + produto.getNomeProd());
        }

        // 2. DEDUZ A QUANTIDADE DO ESTOQUE
        produto.setQuantidade(produto.getQuantidade().subtract(quantidade));

        // 3. SALVA A DEDUÇÃO NO ESTOQUE (Persiste a alteração no banco)

        estoqueRepository.save(produto);

        // -------------------------------------------------------------------------

        // Verifica se o item já existe no carrinho (Lógica anterior)
        Optional<CarrinhoItemModel> itemExistente = carrinho.getItens().stream()
                .filter(item -> item.getEstoque().getIdEstoque().equals(idEstoque))
                .findFirst();

        CarrinhoItemModel itemParaSalvar;

        if (itemExistente.isPresent()) {
            itemParaSalvar = itemExistente.get();
            itemParaSalvar.setQuantItem(itemParaSalvar.getQuantItem().add(quantidade));
        } else {
            itemParaSalvar = new CarrinhoItemModel();
            CarrinhoItemId id = new CarrinhoItemId(carrinho.getIdCarrinho(), produto.getIdEstoque());

            itemParaSalvar.setId(id);
            itemParaSalvar.setCarrinho(carrinho);
            itemParaSalvar.setEstoque(produto);
            itemParaSalvar.setQuantItem(quantidade);
            itemParaSalvar.setPrecoUnit(produto.getValorProd());

            carrinho.getItens().add(itemParaSalvar);
        }

        // 4. Salva o Item e o Carrinho (Lógica de Persistência)
        carrinhoItemRepository.save(itemParaSalvar);
        atualizarTotal(carrinho);
        return carrinhoRepository.save(carrinho);
    }

    // 3. Método auxiliar para recalcular totais
    private void atualizarTotal(CarrinhoModel carrinho) {
        BigDecimal total = BigDecimal.ZERO;
        for (CarrinhoItemModel item : carrinho.getItens()) {
            BigDecimal subtotal = item.getPrecoUnit().multiply(item.getQuantItem());
            total = total.add(subtotal);
        }
        carrinho.setPrecototal(total);
    }

    @Transactional
    public CarrinhoModel buscarPorId(Long id) {
        return carrinhoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Carrinho não encontrado com o ID: " + id));
    }
}