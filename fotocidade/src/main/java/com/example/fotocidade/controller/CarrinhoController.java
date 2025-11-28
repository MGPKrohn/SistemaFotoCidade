package com.example.fotocidade.controller;

import com.example.fotocidade.models.CarrinhoModel;
import com.example.fotocidade.service.CarrinhoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/carrinhos")
public class CarrinhoController {

    @Autowired
    private CarrinhoService carrinhoService;

    // POST: Cria um carrinho vazio
    @PostMapping
    public ResponseEntity<CarrinhoModel> criar() {
        return ResponseEntity.ok(carrinhoService.criarCarrinho());
    }

    // POST: Adiciona item (passando params na URL)
    // Ex: /carrinhos/1/adicionar?idEstoque=5&quantidade=2
    @PostMapping("/{idCarrinho}/adicionar")
    public ResponseEntity<CarrinhoModel> adicionarItem(
            @PathVariable Long idCarrinho,
            @RequestParam Long idEstoque,
            @RequestParam BigDecimal quantidade) {

        try {
            CarrinhoModel carrinho = carrinhoService.adicionarItem(idCarrinho, idEstoque, quantidade);
            return ResponseEntity.ok(carrinho);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build(); // Retorna erro 400 se produto/carrinho não existir
        }
    }

    @GetMapping("/{idCarrinho}")
    public ResponseEntity<CarrinhoModel> buscar(@PathVariable Long idCarrinho) {
        try {
            CarrinhoModel carrinho = carrinhoService.buscarPorId(idCarrinho);
            return ResponseEntity.ok(carrinho);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build(); // Retorna 404 se não existir
        }
    }
}