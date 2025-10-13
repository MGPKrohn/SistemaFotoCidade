package com.example.fotocidade.models;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "carrinho")
public class CarrinhoModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCarrinho;

    private BigDecimal precototal;

    @ManyToOne
    @JoinColumn(name = "id_checkout")
    private CheckoutModel checkout;

    @OneToMany(
            mappedBy = "carrinho",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )

   private List<CarrinhoItemModel> itens = new ArrayList<>();

    public CarrinhoModel(Long idCarrinho, BigDecimal precototal, CheckoutModel checkout, List<CarrinhoItemModel> itens) {
        this.idCarrinho = idCarrinho;
        this.precototal = precototal;
        this.checkout = checkout;
        this.itens = itens;
    }

    public Long getIdCarrinho() {
        return idCarrinho;
    }

    public void setIdCarrinho(Long idCarrinho) {
        this.idCarrinho = idCarrinho;
    }

    public BigDecimal getPrecototal() {
        return precototal;
    }

    public void setPrecototal(BigDecimal precototal) {
        this.precototal = precototal;
    }

    public CheckoutModel getCheckout() {
        return checkout;
    }

    public void setCheckout(CheckoutModel checkout) {
        this.checkout = checkout;
    }

    public List<CarrinhoItemModel> getItens() {
        return itens;
    }

    public void setItens(List<CarrinhoItemModel> itens) {
        this.itens = itens;
    }
}
