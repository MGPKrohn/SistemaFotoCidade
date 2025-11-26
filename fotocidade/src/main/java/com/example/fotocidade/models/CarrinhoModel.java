package com.example.fotocidade.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference; // <- RECOMENDADO para evitar loops de serialização

@Entity
@Table(name = "carrinho")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class CarrinhoModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCarrinho;

    private BigDecimal precototal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_checkout")
    private CheckoutModel checkout;

    @OneToMany(
            mappedBy = "carrinho", // 'carrinho' é o nome do campo na CarrinhoItemModel
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.EAGER
    )
    @JsonManagedReference // Indica o lado 'pai' do relacionamento, evita serialização em loop
    private List<CarrinhoItemModel> itens = new ArrayList<>(); // Inicializar para evitar NullPointerException

    // --- Métodos de Conveniência (Corrigidos para refletir o nome do campo) ---

    public void adicionarItem(CarrinhoItemModel item) {
        itens.add(item);
        item.setCarrinho(this);
        // O item também precisa do EstoqueModel para ser válido
        // item.setId(new CarrinhoItemId(this.idCarrinho, item.getEstoque().getIdEstoque())); // Se você tiver o EstoqueModel
    }

    public void removerItem(CarrinhoItemModel item) {
        itens.remove(item);
        item.setCarrinho(null);
    }

    public CarrinhoModel(){}


    public CarrinhoModel(Long idCarrinho, BigDecimal precototal, CheckoutModel checkout, List<CarrinhoItemModel> itens) {
        this.idCarrinho = idCarrinho;
        this.precototal = precototal;
        this.checkout = checkout;
        this.itens = itens;
    }

    public List<CarrinhoItemModel> getItens() {
        return itens;
    }

    public void setItens(List<CarrinhoItemModel> itens) {
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
}