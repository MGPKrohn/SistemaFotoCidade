package com.example.fotocidade.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    @JsonIgnore // Usa @JsonIgnore ou @JsonBackReference para evitar loops de serialização
    private CarrinhoModel carrinho; // Nome do campo é minúsculo, o getter/setter deve seguir

    // Construtor padrão exigido pelo JPA
    public CheckoutModel() {
    }

    // Seu construtor completo
    public CheckoutModel(Long idCheckout, CarrinhoModel carrinho, BigDecimal precoTotal, String formaDePagamento, BigDecimal valorRecebido, BigDecimal valorDevolucao) {
        this.idCheckout = idCheckout;
        this.carrinho = carrinho;
        this.precoTotal = precoTotal;
        this.formaDePagamento = formaDePagamento;
        this.valorRecebido = valorRecebido;
        this.valorDevolucao = valorDevolucao;
    }

    // Corrija os nomes dos getters/setters para seguir a convenção Java (get/set seguido do nome do campo com a primeira letra maiúscula)
    public CarrinhoModel getCarrinho() {
        return carrinho;
    }

    public void setCarrinho(CarrinhoModel carrinho) {
        this.carrinho = carrinho;
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
