// /src/services/CarrinhoService.js

const API = 'http://localhost:8080';

// ==============================================
// 1. Criar Carrinho
// ==============================================
export const criarNovoCarrinho = async () => {
    try {
        const response = await fetch(`${API}/carrinhos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Erro ao criar novo carrinho.');
        }
        return await response.json(); // Retorna o CarrinhoModel recém-criado
    } catch (error) {
        console.error("Falha na criação do carrinho:", error);
        throw error; 
    }
};

// ==============================================
// 2. Adicionar Item ao Carrinho (Com Controle de Estoque)
// ==============================================
export const adicionarItemAoCarrinho = async (idCarrinho, idEstoque, quantidade) => {
    // Agora passamos os dados na URL com '?' e '&'
    const url = `${API}/carrinhos/${idCarrinho}/adicionar?idEstoque=${idEstoque}&quantidade=${quantidade}`;
    
    try {
        const response = await fetch(url, {
            method: 'POST', // Backend espera POST
            headers: {
                'Content-Type': 'application/json',
            },
            // REMOVEMOS O BODY POIS OS DADOS JÁ ESTÃO NA URL
        });

        if (response.status === 400) {
            // Tenta ler a mensagem de erro do backend (ex: estoque insuficiente)
            const errorText = await response.text(); 
            throw new Error(errorText || 'Erro de validação');
        }
        
        if (!response.ok) {
            throw new Error('Erro ao adicionar item.');
        }

        return await response.json(); 
    } catch (error) {
        console.error("Erro adicionar item:", error);
        throw error;
    }
};

// ==============================================
// 3. Buscar Carrinho por ID
// ==============================================
export const buscarCarrinho = async (idCarrinho) => {
    try {
        const response = await fetch(`${API}/carrinhos/${idCarrinho}`);
        if (!response.ok) {
            throw new Error('Carrinho não encontrado.');
        }
        return await response.json(); // Retorna o CarrinhoModel com itens e total
    } catch (error) {
        console.error("Falha ao buscar carrinho:", error);
        throw error;
    }
};