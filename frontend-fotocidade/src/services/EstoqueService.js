// /src/services/EstoqueService.js

const API = 'http://localhost:8080';

// ==============================================
// 1. Buscar todos os Produtos do Estoque (GET)
// ==============================================
export const listarTodosProdutos = async () => {
    try {
        // Chamada para a nova rota que filtra estoque > 0
        const response = await fetch(`${API}/estoque/disponiveis`); 
        if (!response.ok) {
            throw new Error('Erro ao buscar lista de produtos disponíveis.');
        }
        return await response.json(); 
    } catch (error) {
        console.error("Falha ao listar produtos:", error);
        throw error; 
    }
};

// ==============================================
// 2. Criar novo Produto no Estoque (POST)
// ==============================================
export const criarProdutoEstoque = async (produtoData) => {
    try {
        const response = await fetch(`${API}/estoque`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(produtoData),
        });
        if (!response.ok) {
            throw new Error('Erro ao criar novo produto no estoque.');
        }
        return await response.json();
    } catch (error) {
        console.error("Falha na criação do produto:", error);
        throw error; 
    }  
// ==============================================
};

// 3. Atualizar Produto no Estoque (PUT)
export const atualizarProdutoEstoque = async (idEstoque, produtoData) => {
    try {
        const response = await fetch(`${API}/estoque/${idEstoque}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(produtoData),
        });
        if (!response.ok) {
            throw new Error('Erro ao atualizar o produto no estoque.');
        }
        return await response.json();
    } catch (error) {
        console.error("Falha na atualização do produto:", error);
        throw error; 
    }
};
