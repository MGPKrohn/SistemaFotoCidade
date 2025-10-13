package com.example.fotocidade.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "estoque")
public class EstoqueModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEstoque;

    private String nomeProd;

    private BigDecimal valorProd;

    private String categoria;

    private Integer quantidade;

    public EstoqueModel(Long idEstoque, String nomeProd, String categoria, Integer quantidade, BigDecimal valorProd) {
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

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }
}
