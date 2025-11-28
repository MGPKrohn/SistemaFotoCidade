// /src/pages/CheckoutPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 
import { buscarCarrinho } from '../services/CarrinhoService';
import { finalizarCompra } from '../services/ChcekoutService';

function CheckoutPage() {
    const { idCarrinho } = useParams(); // Pega o ID da URL (ex: /checkout/15)
    const navigate = useNavigate();
    
    const [carrinho, setCarrinho] = useState(null);
    const [formaPagamento, setFormaPagamento] = useState('Dinheiro');
    const [valorRecebido, setValorRecebido] = useState(0);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState(null);

    // --- Carrega o Carrinho ---
    useEffect(() => {
        const carregarCarrinho = async () => {
            if (!idCarrinho) {
                setFeedback('ID do Carrinho não fornecido.');
                return;
            }
            try {
                const dadosCarrinho = await buscarCarrinho(idCarrinho);
                setCarrinho(dadosCarrinho);
                // Define o valor recebido inicial igual ao total, para facilitar
                setValorRecebido(parseFloat(dadosCarrinho.precototal)); 
            } catch (err) {
                setFeedback('Erro ao carregar o carrinho.');
            } finally {
                setLoading(false);
            }
        };
        carregarCarrinho();
    }, [idCarrinho]);

    // --- Finalizar a Compra ---
    const handleFinalizar = async (e) => {
        e.preventDefault();
        setFeedback(null);

        const valorTotal = parseFloat(carrinho.precototal);
        const valorRecebidoNum = parseFloat(valorRecebido);
        
        if (valorRecebidoNum < valorTotal) {
            setFeedback('Erro: Valor recebido é insuficiente.');
            return;
        }

        try {
            const resultadoCheckout = await finalizarCompra(
                idCarrinho,
                formaPagamento,
                valorRecebidoNum
            );
            
            // Limpa o carrinho do armazenamento local, pois a venda está concluída
            localStorage.removeItem('meuCarrinhoId');

            setFeedback(`✅ Compra finalizada! Troco: R$ ${resultadoCheckout.valorDevolucao.toFixed(2)}.`);
            
            // Redireciona após o sucesso
            setTimeout(() => {
                 navigate('/'); // Volta para a página inicial de produtos
            }, 3000);

        } catch (err) {
            setFeedback(`❌ Erro ao processar pagamento: ${err.message}`);
        }
    };
    
    if (loading) return <div>Carregando Checkout...</div>;
    if (!carrinho) return <div style={{ color: 'red', padding: '20px' }}>{feedback || 'Carrinho não encontrado.'}</div>;
    
    const valorTotal = parseFloat(carrinho.precototal);
    const valorRecebidoNum = parseFloat(valorRecebido);
    const troco = valorRecebidoNum > valorTotal ? valorRecebidoNum - valorTotal : 0;

    return (
        <div style={checkoutStyles.container}>
            <h2>Finalizar Checkout #{idCarrinho}</h2>
            
            <div style={checkoutStyles.layout}>
                
                {/* 1. Resumo do Carrinho */}
                <div style={checkoutStyles.summaryPanel}>
                    <h3>Resumo da Compra</h3>
                    {carrinho.itens.map(item => (
                        <div key={item.estoque.idEstoque} style={checkoutStyles.summaryItem}>
                            <span>{item.quantItem}x {item.estoque.nome_prod}</span>
                            <span>R$ {(item.quantItem * item.precoUnit).toFixed(2)}</span>
                        </div>
                    ))}
                    <h3 style={checkoutStyles.total}>
                        TOTAL: R$ {valorTotal.toFixed(2)}
                    </h3>
                </div>

                {/* 2. Formulário de Pagamento */}
                <div style={checkoutStyles.formPanel}>
                    <h3>Pagamento</h3>
                    <form onSubmit={handleFinalizar}>
                        
                        <div style={checkoutStyles.formGroup}>
                            <label>Forma de Pagamento:</label>
                            <select 
                                value={formaPagamento} 
                                onChange={(e) => setFormaPagamento(e.target.value)}
                                style={checkoutStyles.input}
                            >
                                <option value="Dinheiro">Dinheiro</option>
                                <option value="Cartao">Cartão de Crédito/Débito</option>
                                <option value="Pix">Pix</option>
                            </select>
                        </div>
                        
                        <div style={checkoutStyles.formGroup}>
                            <label>Valor Recebido:</label>
                            <input 
                                type="number" 
                                step="0.01" 
                                value={valorRecebido} 
                                onChange={(e) => setValorRecebido(e.target.value)}
                                style={checkoutStyles.input}
                            />
                        </div>

                        {/* Visualização do Troco */}
                        <h4 style={{ color: troco > 0 ? 'blue' : 'black', marginTop: '20px' }}>
                            Troco: R$ {troco.toFixed(2)}
                        </h4>
                        
                        {feedback && (
                            <div style={{ color: feedback.startsWith('✅') ? 'green' : 'red', fontWeight: 'bold', margin: '15px 0' }}>
                                {feedback}
                            </div>
                        )}
                        
                        <button 
                            type="submit" 
                            disabled={valorRecebidoNum < valorTotal} 
                            style={checkoutStyles.buttonSubmit}
                        >
                            Pagar e Concluir
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

// Estilos para o Checkout
const checkoutStyles = {
    container: { padding: '40px', fontFamily: 'Arial, sans-serif' },
    layout: { display: 'flex', gap: '40px', border: '1px solid #ccc', padding: '20px', borderRadius: '8px', backgroundColor: '#fff' },
    summaryPanel: { flex: 1, paddingRight: '20px' },
    formPanel: { flex: 1 },
    summaryItem: { display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px dotted #eee' },
    total: { borderTop: '2px solid black', paddingTop: '10px', marginTop: '15px' },
    formGroup: { marginBottom: '15px' },
    input: { width: '100%', padding: '8px', boxSizing: 'border-box', marginTop: '5px' },
    buttonSubmit: { padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1.1em' }
};

export default CheckoutPage;