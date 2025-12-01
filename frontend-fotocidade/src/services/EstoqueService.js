// /src/services/EstoqueService.js

const API_BASE_URL = 'http://localhost:8080';

export const listarTodosProdutos = async () => {
    // Usamos a rota que traz tudo (inclusive estoque 0) para o admin
    const response = await fetch(`${API_BASE_URL}/estoque`); 
    return await response.json();
};

export const salvarProduto = async (produto) => {
    // O backend já tem a lógica de "Upsert" (Criar ou Atualizar pelo nome/ID)
    const response = await fetch(`${API_BASE_URL}/estoque`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produto)
    });
    return await response.json();
};

export const deletarProduto = async (id) => {
    await fetch(`${API_BASE_URL}/estoque/${id}`, {
        method: 'DELETE'
    });
};