package com.example.fotocidade.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "carrinho_item")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class CarrinhoItemModel {

    @EmbeddedId
    private CarrinhoItemId id = new CarrinhoItemId();

    @MapsId("carrinho") // Mapeia o campo 'carrinho' do ID embutido
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_carrinho", nullable = false) // Coluna de FK na tabela carrinho_item
    @com.fasterxml.jackson.annotation.JsonIgnore
    private CarrinhoModel carrinho;

    @MapsId("estoque") // Mapeia o campo 'estoque' do ID embutido
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_estoque", nullable = false) // Coluna de FK na tabela carrinho_item
    private EstoqueModel estoque;

    @Column(name = "quant_item", nullable = false)
    private BigDecimal quantItem;

    @Column(name = "preco_unit", nullable = false)
    private BigDecimal precoUnit;

    public CarrinhoItemModel() {
    }

    public CarrinhoItemModel(CarrinhoItemId id, CarrinhoModel carrinho, EstoqueModel estoque, BigDecimal quantItem, BigDecimal precoUnit) {
        this.id = id;
        this.carrinho = carrinho;
        this.estoque = estoque;
        this.quantItem = quantItem;
        this.precoUnit = precoUnit;
    }

    public CarrinhoItemId getId() {
        return id;
    }

    public void setId(CarrinhoItemId id) {
        this.id = id;
    }

    public CarrinhoModel getCarrinho() {
        return carrinho;
    }

    public void setCarrinho(CarrinhoModel carrinho) {
        this.carrinho = carrinho;
    }

    public EstoqueModel getEstoque() {
        return estoque;
    }

    public void setEstoque(EstoqueModel estoque) {
        this.estoque = estoque;
    }

    public BigDecimal getQuantItem() {
        return quantItem;
    }

    public void setQuantItem(BigDecimal quantItem) {
        this.quantItem = quantItem;
    }

    public BigDecimal getPrecoUnit() {
        return precoUnit;
    }

    public void setPrecoUnit(BigDecimal precoUnit) {
        this.precoUnit = precoUnit;
    }
}
