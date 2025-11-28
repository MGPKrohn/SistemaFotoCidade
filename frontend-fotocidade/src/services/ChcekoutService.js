// /src/services/CheckoutService.js (Certifique-se de que está assim)

const API_BASE_URL = 'http://localhost:8080';

export const finalizarCompra = async (idCarrinho, formaDePagamento, valorRecebido) => {
    const url = `${API_BASE_URL}/checkout/carrinho/${idCarrinho}`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                formaDePagamento: formaDePagamento,
                valorRecebido: valorRecebido
            })
        });

        if (response.status === 400) {
            const errorText = await response.text();
            throw new Error(errorText || 'Valor recebido insuficiente ou erro de validação.');
        }
        
        if (!response.ok) {
            throw new Error('Erro ao finalizar a compra.');
        }

        return await response.json(); // Retorna o CheckoutModel finalizado
    } catch (error) {
        console.error("Falha ao finalizar compra:", error);
        throw error;
    }
};