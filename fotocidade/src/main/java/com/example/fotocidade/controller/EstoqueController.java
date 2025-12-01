package com.example.fotocidade.controller;

import com.example.fotocidade.models.EstoqueModel;
import com.example.fotocidade.service.EstoqueService;
import org.hibernate.engine.spi.Resolution;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/estoque")
@CrossOrigin(origins = "http://localhost:5173")
public class EstoqueController {

    @Autowired
    private EstoqueService estoqueService;

    // GET: Lista apenas disponíveis (> 0)
    @GetMapping("/disponiveis")
    public ResponseEntity<List<EstoqueModel>> listarDisponiveis() {
        return ResponseEntity.ok(estoqueService.listarDisponiveis());
    }

    // GET: Lista TUDO (Inclusive zerados - útil para admin)
    @GetMapping
    public ResponseEntity<List<EstoqueModel>> listarTodos() {
        return ResponseEntity.ok(estoqueService.listarTodos());
    }

    // POST: Cria ou Atualiza Estoque
    @PostMapping
    public ResponseEntity<EstoqueModel> criarOuAtualizar(@RequestBody EstoqueModel produto) {
        // Chama o método inteligente que soma quantidade se já existir
        EstoqueModel salvo = estoqueService.cadastrarOuAtualizar(produto);
        return ResponseEntity.ok(salvo);
    }

    // Adicione este endpoint
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        estoqueService.deletarProduto(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{idEstoque}")
    public ResponseEntity<EstoqueModel> atualizarEstoque(
            @PathVariable(value = "idEstoque") Long idEstoque,
            @RequestBody EstoqueModel estoqueModel) {

        // Chama o método de atualização por ID no Service
        Optional<EstoqueModel> estoqueAtualizado = estoqueService.atualizarPorId(idEstoque, estoqueModel);

        if (estoqueAtualizado.isEmpty()) {
            // Se o ID não for encontrado, retorna 404 Not Found
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        // Retorna 200 OK com o item atualizado no corpo
        return ResponseEntity.status(HttpStatus.OK).body(estoqueAtualizado.get());
    }
}