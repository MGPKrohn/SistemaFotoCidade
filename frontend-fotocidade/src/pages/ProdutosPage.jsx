// /src/pages/ProdutosPage.js

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Para navegar para o Checkout
import { listarTodosProdutos } from '../services/EstoqueService';
import { criarNovoCarrinho, adicionarItemAoCarrinho, buscarCarrinho } from '../services/CarrinhoService';

// =========================================================
// SUB-COMPONENTE: Cartão de Produto Individual
// =========================================================
const ProdutoCard = ({ produto, onAdicionar, carrinhoAtivo }) => {
    const [quantidade, setQuantidade] = useState(1);
    
    // Converte a quantidade do backend (BigDecimal string) para float/number para comparação
    const estoqueDisponivel = parseFloat(produto.quantidade);

    const handleClick = () => {
        const qtdParaAdicionar = parseInt(quantidade);
        
        if (qtdParaAdicionar <= 0 || isNaN(qtdParaAdicionar)) {
            alert("A quantidade deve ser um número positivo.");
            return;
        }
        if (qtdParaAdicionar > estoqueDisponivel) {
            alert(`Estoque insuficiente! Máximo disponível: ${estoqueDisponivel}`);
            return;
        }
        onAdicionar(produto.idEstoque, qtdParaAdicionar);
        setQuantidade(1); // Reseta o input após adicionar
    };

    return (
        <div style={styles.card}>
            <h4>{produto.nomeProd}</h4>
            <p>R$ <strong>{produto.valorProd}</strong></p>
            <p style={{ color: estoqueDisponivel > 0 ? 'green' : 'red' }}>
                Estoque: {estoqueDisponivel}
            </p>

            <div style={{ margin: '10px 0', display: 'flex', gap: '5px', alignItems: 'center' }}>
                <label>Qtd:</label>
                <input 
                    type="number" 
                    min="1" 
                    value={quantidade}
                    onChange={(e) => setQuantidade(e.target.value)}
                    disabled={!carrinhoAtivo || estoqueDisponivel <= 0}
                    style={{ width: '50px', padding: '5px' }}
                />
            </div>

            <button 
                onClick={handleClick}
                disabled={!carrinhoAtivo || estoqueDisponivel <= 0}
                style={{ ...styles.button, backgroundColor: (!carrinhoAtivo || estoqueDisponivel <= 0) ? '#ccc' : '#007bff' }}
            >
                Adicionar
            </button>
        </div>
    );
};

// =========================================================
// COMPONENTE PRINCIPAL: ProdutosPage
// =========================================================
function ProdutosPage() {
    const [produtos, setProdutos] = useState([]);
    const [carrinhoId, setCarrinhoId] = useState(null);
    const [carrinho, setCarrinho] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Hook do React Router

    // Função para carregar produtos (usada no inicio e após adicionar item)
    const carregarProdutos = useCallback(async () => {
        try {
            const dados = await listarTodosProdutos(); // Chama o endpoint /estoque/disponiveis
            setProdutos(dados);
        } catch (error) {
            console.error("Erro ao carregar produtos:", error);
        }
    }, []);

    // Efeito: Carregamento Inicial e Restauração do Carrinho
    useEffect(() => {
        const iniciarPagina = async () => {
            setLoading(true);
            await carregarProdutos();

            const idSalvo = localStorage.getItem('meuCarrinhoId');
            if (idSalvo) {
                try {
                    const carrinhoSalvo = await buscarCarrinho(idSalvo);
                    // Verifica se o carrinho já foi para o checkout
                    if (carrinhoSalvo.checkout) {
                        localStorage.removeItem('meuCarrinhoId');
                    } else {
                        setCarrinhoId(idSalvo);
                        setCarrinho(carrinhoSalvo);
                    }
                } catch (e) {
                    console.warn("Carrinho antigo não encontrado ou inválido.");
                    localStorage.removeItem('meuCarrinhoId');
                }
            }
            setLoading(false);
        };
        iniciarPagina();
    }, [carregarProdutos]);

    const handleCriarCarrinho = async () => {
        try {
            const novo = await criarNovoCarrinho();
            setCarrinhoId(novo.idCarrinho);
            setCarrinho(novo);
            localStorage.setItem('meuCarrinhoId', novo.idCarrinho);
        } catch (err) {
            alert('Falha ao criar o carrinho.');
        }
    };

    const handleAdicionarItem = async (idEstoque, quantidade) => {
        try {
            const carrinhoAtualizado = await adicionarItemAoCarrinho(carrinhoId, idEstoque, quantidade);
            setCarrinho(carrinhoAtualizado);
            
            // Recarrega a lista de produtos para atualizar o estoque na tela
            await carregarProdutos(); 
            
        } catch (err) {
            alert(`Erro ao adicionar item: ${err.message}`);
        }
    };

    const handleLimparCarrinho = () => {
        localStorage.removeItem('meuCarrinhoId');
        setCarrinhoId(null);
        setCarrinho(null);
        carregarProdutos(); // Atualiza estoque, caso o usuário queira vender o item que sobrou
    };
    
    // Navega para o checkout
    const handleCheckout = () => {
        
        // 1. Loga para ver se a função está sendo chamada
        console.log("Tentativa de Checkout. ID:", carrinhoId); 

        if (carrinho && carrinho.itens && carrinho.itens.length > 0) {
            // 2. Loga o destino
            console.log("Navegando para:", `/checkout/${carrinhoId}`);
            navigate(`/checkout/${carrinhoId}`);
        } else {
            // 3. Verifica se este alert está disparando
            alert("O carrinho está vazio!");
        }
    };

    if (loading) return <div style={styles.loading}>Carregando sistema...</div>;

    return (
        <div style={styles.container}>
            <h2>📸 Sistema FotoCidade</h2>
            
            <div style={styles.mainLayout}>
                
                {/* COLUNA DA ESQUERDA: PRODUTOS */}
                <div style={styles.productColumn}>
                    <h3>Estoque Disponível</h3>
                    <div style={styles.productList}>
                        {produtos.map(prod => (
                            <ProdutoCard 
                                key={prod.idEstoque} 
                                produto={prod} 
                                onAdicionar={handleAdicionarItem}
                                carrinhoAtivo={!!carrinhoId}
                            />
                        ))}
                    </div>
                </div>

                {/* COLUNA DA DIREITA: CARRINHO */}
                <div style={styles.cartPanel}>
                    <h3>🛒 Seu Carrinho</h3>
                    
                    {!carrinhoId ? (
                        <div style={styles.cartEmpty}>
                            <p>Nenhum carrinho aberto.</p>
                            <button onClick={handleCriarCarrinho} style={styles.buttonSuccess}>
                                Iniciar Nova Compra
                            </button>
                        </div>
                    ) : (
                        <>
                            <div style={styles.cartSummary}>
                                <p><strong>ID Carrinho:</strong> #{carrinhoId}</p>
                                <p><strong>TOTAL:</strong> <span style={{ fontSize: '1.2em', color: 'green' }}>R$ {carrinho?.precototal || '0.00'}</span></p>
                            </div>

                            <div style={styles.cartItemsList}>
                                {carrinho?.itens && carrinho.itens.length > 0 ? (
                                    <ul style={styles.ul}>
                                        {carrinho.itens.map((item, index) => (
                                            <li key={index} style={styles.cartItem}>
                                                <div>
                                                    <strong>{item.estoque.nome_prod}</strong>
                                                    <div style={styles.cartItemDetails}>
                                                        {item.quantItem}x @ R$ {item.precoUnit}
                                                    </div>
                                                </div>
                                                <div style={styles.cartItemPrice}>
                                                    R$ {(item.quantItem * item.precoUnit).toFixed(2)}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p style={styles.cartEmptyText}>O carrinho está vazio.</p>
                                )}
                            </div>

                            <div style={styles.cartActions}>
                                <button onClick={handleCheckout} style={styles.buttonCheckout}>
                                    Finalizar Compra
                                </button>
                                <button onClick={handleLimparCarrinho} style={styles.buttonDanger}>
                                    Cancelar
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

// Estilos CSS-in-JS
const styles = {
    container: { padding: '20px', fontFamily: 'Arial, sans-serif' },
    loading: { textAlign: 'center', padding: '50px' },
    mainLayout: { display: 'flex', gap: '20px', alignItems: 'flex-start', marginTop: '20px' },
    productColumn: { flex: 2 },
    productList: { display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '10px' },
    card: { border: '1px solid #e1e1e1', borderRadius: '8px', padding: '15px', width: '200px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', backgroundColor: 'white' },
    button: { width: '100%', padding: '8px', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    cartPanel: { flex: 1, border: '1px solid #007bff', borderRadius: '8px', padding: '20px', backgroundColor: '#f8faff', minWidth: '300px' },
    cartEmpty: { textAlign: 'center', padding: '20px' },
    buttonSuccess: { padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1em' },
    cartSummary: { marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #ddd' },
    cartItemsList: { maxHeight: '300px', overflowY: 'auto' },
    ul: { listStyle: 'none', padding: 0 },
    cartItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px dashed #ccc' },
    cartItemDetails: { fontSize: '0.85em', color: '#666' },
    cartItemPrice: { fontWeight: 'bold' },
    cartEmptyText: { fontStyle: 'italic', color: '#999' },
    cartActions: { marginTop: '20px', display: 'flex', gap: '10px' },
    buttonCheckout: { flex: 1, padding: '10px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
    buttonDanger: { padding: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }
};

export default ProdutosPage;