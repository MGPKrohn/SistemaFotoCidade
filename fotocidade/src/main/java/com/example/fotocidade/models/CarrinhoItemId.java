package com.example.fotocidade.models;

import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class CarrinhoItemId implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long carrinho;
    private Long estoque;

    public CarrinhoItemId(Long carrinho, Long estoque) {
        this.carrinho = carrinho;
        this.estoque = estoque;
    }

    public CarrinhoItemId() {

    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CarrinhoItemId that = (CarrinhoItemId) o;
        return Objects.equals(carrinho, that.carrinho) &&
                Objects.equals(estoque, that.estoque);
    }

    @Override
    public int hashCode() {
        return Objects.hash(carrinho, estoque);
    }

    public Long getCarrinho() {
        return carrinho;
    }

    public void setCarrinho(Long carrinho) {
        this.carrinho = carrinho;
    }

    public Long getEstoque() {
        return estoque;
    }

    public void setEstoque(Long estoque) {
        this.estoque = estoque;
    }
}
