package com.example.fotocidade.controller;

import com.example.fotocidade.models.CheckoutModel;
import com.example.fotocidade.service.CheckoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/checkout")
public class CheckoutController {

    @Autowired
    private CheckoutService checkoutService;


    private static class CheckoutPayload {
        private String formaDePagamento;
        private BigDecimal valorRecebido;


        public String getFormaDePagamento() { return formaDePagamento; }
        public void setFormaDePagamento(String formaDePagamento) { this.formaDePagamento = formaDePagamento; }
        public BigDecimal getValorRecebido() { return valorRecebido; }
        public void setValorRecebido(BigDecimal valorRecebido) { this.valorRecebido = valorRecebido; }
    }


    // Para Testes no Postman e EndPoint Configurados
    // URL: http://localhost:8080/checkout/carrinho/{idCarrinho}
    // Body (JSON): { "formaDePagamento": "Dinheiro", "valorRecebido": 105.00 }
    @PostMapping("/carrinho/{idCarrinho}")
    public ResponseEntity<CheckoutModel> finalizarCompra(
            @PathVariable Long idCarrinho,
            @RequestBody CheckoutPayload payload) { // <--- USANDO A CLASSE INTERNA PARA RECEBER O JSON

        try {
            CheckoutModel checkoutFinalizado = checkoutService.finalizarCheckout(
                    idCarrinho,
                    payload.getFormaDePagamento(), // Passa o campo diretamente
                    payload.getValorRecebido()    // Passa o campo diretamente
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(checkoutFinalizado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().header("Error-Message", e.getMessage()).build();
        }
    }

    @GetMapping("/{idCheckout}")
    public ResponseEntity<CheckoutModel> buscarCheckoutPorId(@PathVariable Long idCheckout) {
        try {
            CheckoutModel checkout = checkoutService.buscarPorId(idCheckout);
            return ResponseEntity.ok(checkout);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}