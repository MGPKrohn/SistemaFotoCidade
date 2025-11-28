package com.example.fotocidade.service;

import com.example.fotocidade.models.CarrinhoModel;
import com.example.fotocidade.models.CheckoutModel;
import com.example.fotocidade.repository.CarrinhoRepository;
import com.example.fotocidade.repository.CheckoutRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class CheckoutService {

    @Autowired
    private CheckoutRepository checkoutRepository;

    @Autowired
    private CarrinhoRepository carrinhoRepository;

    @Transactional
    public CheckoutModel finalizarCheckout(
            Long idCarrinho,
            String formaDePagamento,
            BigDecimal valorRecebido) { // <--- RECEBENDO CAMPOS DIRETAMENTE

        // 1. Busca e valida o carrinho
        CarrinhoModel carrinho = carrinhoRepository.findById(idCarrinho)
                .orElseThrow(() -> new RuntimeException("Carrinho não encontrado!"));

        // Verifica se o carrinho já foi finalizado
        if (carrinho.getCheckout() != null) {
            throw new RuntimeException("Este carrinho já foi finalizado (ID do Checkout: " + carrinho.getCheckout().getIdCheckout() + ")");
        }

        BigDecimal precoTotal = carrinho.getPrecototal();

        // 2. Validação e Cálculo do Troco/Devolução
        if (valorRecebido.compareTo(precoTotal) < 0) {
            throw new RuntimeException("Valor recebido insuficiente. O valor total é R$ " + precoTotal);
        }

        // Calcula o troco (valor de devolução)
        BigDecimal valorDevolucao = valorRecebido.subtract(precoTotal).setScale(2, RoundingMode.HALF_EVEN);

        // 3. Cria e preenche o CheckoutModel
        CheckoutModel checkout = new CheckoutModel();
        checkout.setPrecoTotal(precoTotal);
        checkout.setFormaDePagamento(formaDePagamento); // Campo direto
        checkout.setValorRecebido(valorRecebido); // Campo direto
        checkout.setValorDevolucao(valorDevolucao);

        // 4. Salva o Checkout
        checkout = checkoutRepository.save(checkout);

        // 5. Atualiza o Carrinho (faz a ligação OneToOne)
        carrinho.setCheckout(checkout);
        carrinhoRepository.save(carrinho);

        // Retorna o checkout finalizado
        return checkout;
    }

    public CheckoutModel buscarPorId(Long id) {
        return checkoutRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Checkout não encontrado com o ID: " + id));
    }
}