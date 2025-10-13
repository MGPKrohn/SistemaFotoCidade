package com.example.fotocidade.models;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "checkout")
public class CheckoutModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCheckout;

    private BigDecimal precoTotal;

    private String formaDePagamento;

    private BigDecimal valorRecebido;

    private BigDecimal valorDevolucao;

    @OneToOne(mappedBy = "checkout", fetch = FetchType.LAZY)
    private CarrinhoModel carrinho;

    public CheckoutModel(Long idCheckout, CarrinhoModel carrinho, BigDecimal precoTotal, String formaDePagamento, BigDecimal valorRecebido, BigDecimal valorDevolucao) {
        this.idCheckout = idCheckout;
        this.carrinho = carrinho;
        this.precoTotal = precoTotal;
        this.formaDePagamento = formaDePagamento;
        this.valorRecebido = valorRecebido;
        this.valorDevolucao = valorDevolucao;
    }

    public Long getIdCheckout() {
        return idCheckout;
    }

    public void setIdCheckout(Long idCheckout) {
        this.idCheckout = idCheckout;
    }

    public BigDecimal getPrecoTotal() {
        return precoTotal;
    }

    public void setPrecoTotal(BigDecimal precoTotal) {
        this.precoTotal = precoTotal;
    }

    public String getFormaDePagamento() {
        return formaDePagamento;
    }

    public void setFormaDePagamento(String formaDePagamento) {
        this.formaDePagamento = formaDePagamento;
    }

    public BigDecimal getValorRecebido() {
        return valorRecebido;
    }

    public void setValorRecebido(BigDecimal valorRecebido) {
        this.valorRecebido = valorRecebido;
    }

    public BigDecimal getValorDevolucao() {
        return valorDevolucao;
    }

    public void setValorDevolucao(BigDecimal valorDevolucao) {
        this.valorDevolucao = valorDevolucao;
    }

    public CarrinhoModel getcarrinho() {
        return carrinho;
    }

    public void setcarrinho(CarrinhoModel carrinho) {
        this.carrinho = carrinho;
    }
}
