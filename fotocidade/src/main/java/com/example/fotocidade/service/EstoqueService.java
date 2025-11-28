package com.example.fotocidade.service;

import com.example.fotocidade.models.EstoqueModel;
import com.example.fotocidade.repository.EstoqueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@CrossOrigin("*")
public class EstoqueService {

    @Autowired
    private EstoqueRepository estoqueRepository;

    public List<EstoqueModel> listarDisponiveis() {
        return estoqueRepository.findAvailableStock();
    }

    public List<EstoqueModel> listarTodos() {
        return estoqueRepository.findAll();
    }

    @Transactional
    public EstoqueModel cadastrarOuAtualizar(EstoqueModel produtoNovo) {
        // 1. Validação básica: Quantidade não pode ser nula
        if (produtoNovo.getQuantidade() == null) {
            produtoNovo.setQuantidade(BigDecimal.ZERO);
        }

        // 2. Busca se já existe produto com esse nome
        Optional<EstoqueModel> existenteOpt = estoqueRepository.findByNomeProdIgnoreCase(produtoNovo.getNomeProd());

        if (existenteOpt.isPresent()) {
            // --- CENÁRIO: JÁ EXISTE (ATUALIZA) ---
            EstoqueModel produtoExistente = existenteOpt.get();

            // Soma a quantidade nova com a que já tinha
            BigDecimal novaQuantidadeTotal = produtoExistente.getQuantidade().add(produtoNovo.getQuantidade());
            produtoExistente.setQuantidade(novaQuantidadeTotal);

            // Opcional: Atualizar o preço para o valor mais recente ou manter o antigo?
            // Aqui vou atualizar o preço para o novo valor enviado
            if (produtoNovo.getValorProd() != null) {
                produtoExistente.setValorProd(produtoNovo.getValorProd());
            }

            System.out.println("Estoque atualizado para o produto: " + produtoExistente.getNomeProd());
            return estoqueRepository.save(produtoExistente);

        } else {
            // --- CENÁRIO: NOVO PRODUTO (CRIA) ---
            System.out.println("Criando novo produto: " + produtoNovo.getNomeProd());
            return estoqueRepository.save(produtoNovo);
        }
    }

    @Transactional
    public Optional<EstoqueModel> atualizarPorId(Long id, EstoqueModel novosDados) {
        // 1. Busca o item existente pelo ID
        Optional<EstoqueModel> estoqueExistenteOpt = estoqueRepository.findById(id);

        if (estoqueExistenteOpt.isPresent()) {
            EstoqueModel itemAtualizado = estoqueExistenteOpt.get();

            // 2. Transfere os novos dados para o objeto existente
            itemAtualizado.setNomeProd(novosDados.getNomeProd());
            itemAtualizado.setValorProd(novosDados.getValorProd());
            itemAtualizado.setCategoria(novosDados.getCategoria());
            itemAtualizado.setQuantidade(novosDados.getQuantidade());

            // 3. Salva a versão atualizada (Spring Data JPA salva a instância gerenciada)
            return Optional.of(estoqueRepository.save(itemAtualizado));
        }

        // 4. Retorna vazio se o item original não for encontrado
        return Optional.empty();
    }
}