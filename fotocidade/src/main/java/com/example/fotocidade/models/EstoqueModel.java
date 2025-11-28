package com.example.fotocidade.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "estoque")
@CrossOrigin("*")
public class EstoqueModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEstoque;

    private String nomeProd;

    private BigDecimal valorProd;

    private String categoria;

    private BigDecimal quantidade;

    @OneToMany(
            mappedBy = "estoque", // Nome do campo na entidade CarrinhoItemModel que contém o relacionamento @ManyToOne
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY // Otimização: Carrega a lista apenas quando solicitada
    )
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<CarrinhoItemModel> carrinhosOndeEstaPresente;

    public EstoqueModel() {
    }

    public EstoqueModel(Long idEstoque, String nomeProd, String categoria, BigDecimal quantidade, BigDecimal valorProd) {
        this.idEstoque = idEstoque;
        this.nomeProd = nomeProd;
        this.categoria = categoria;
        this.quantidade = quantidade;
        this.valorProd = valorProd;
    }

    public Long getIdEstoque() {
        return idEstoque;
    }

    public void setIdEstoque(Long idEstoque) {
        this.idEstoque = idEstoque;
    }

    public String getNomeProd() {
        return nomeProd;
    }

    public void setNomeProd(String nomeProd) {
        this.nomeProd = nomeProd;
    }

    public BigDecimal getValorProd() {
        return valorProd;
    }

    public void setValorProd(BigDecimal valorProd) {
        this.valorProd = valorProd;
    }

    public BigDecimal getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(BigDecimal quantidade) {
        this.quantidade = quantidade;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }
}
