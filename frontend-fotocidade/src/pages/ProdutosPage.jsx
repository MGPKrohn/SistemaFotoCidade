import React, { useState, useEffect } from 'react';
import { Image as ImageIcon } from 'lucide-react'; // Ícone de imagem placeholder
import { listarTodosProdutos } from '../services/EstoqueService';
import { useCart } from '../context/CartContext'; // Usando o Contexto

const ProdutoCard = ({ produto }) => {
    const { adicionarItem } = useCart();
    const [loading, setLoading] = useState(false);

    const handleAdd = async () => {
        setLoading(true);
        await adicionarItem(produto.idEstoque, 1); // Adiciona 1 por padrão (estilo figma simples)
        setLoading(false);
    };

    return (
        <div style={styles.card}>
            {/* Placeholder da Imagem */}
            <div style={styles.imagePlaceholder}>
                <ImageIcon size={40} color="#999" />
            </div>
            
            <div style={{ textAlign: 'left', width: '100%', marginBottom: '10px' }}>
                <h3 style={{ fontSize: '16px', margin: '5px 0' }}>{produto.nomeProd}</h3>
                <p style={{ margin: 0, fontWeight: 'bold' }}>R$ {produto.valorProd}</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>Estoque: {produto.quantidade}</p>
            </div>

            <button 
                onClick={handleAdd} 
                className="btn-dark"
                style={{ width: '100%', fontSize: '12px' }}
                disabled={produto.quantidade <= 0 || loading}
            >
                {loading ? 'Adicionando...' : 'Adicionar Ao Carrinho'}
            </button>
        </div>
    );
};

const ProdutosPage = () => {
    const [produtos, setProdutos] = useState([]);
    
    // Agora o refresh do estoque pode ser gerido pelo contexto ou recarregado aqui
    useEffect(() => {
        listarTodosProdutos().then(setProdutos);
    }, []); // Idealmente, ouviríamos mudanças no contexto para recarregar isso

    return (
        <div className="page-container">
            <h1 style={{ fontSize: '48px', marginBottom: '40px' }}>Produtos</h1>
            
            <div style={styles.grid}>
                {produtos.map(prod => (
                    <ProdutoCard key={prod.idEstoque} produto={prod} />
                ))}
            </div>
        </div>
    );
};

const styles = {
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '30px' },
    card: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' },
    imagePlaceholder: { 
        width: '100%', height: '180px', backgroundColor: '#fff', 
        border: '2px solid #000', borderRadius: '10px',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        marginBottom: '15px'
    }
};

export default ProdutosPage;