// /src/pages/EstoquePage.jsx

import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';
import { listarTodosProdutos, salvarProduto, deletarProduto } from '../services/EstoqueService';

const EstoquePage = () => {
    const [produtos, setProdutos] = useState([]);
    const [selectedId, setSelectedId] = useState(null); // ID do produto selecionado
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Estado do Formulário
    const [form, setForm] = useState({ id: null, nomeProd: '',categoria: '', valorProd: '', quantidade: '' });

    // 1. Carregar Produtos
    const carregar = async () => {
        const dados = await listarTodosProdutos();
        setProdutos(dados);
    };

    useEffect(() => {
        carregar();
    }, []);

    // 2. Ações dos Botões Superiores
    const handleAdicionar = () => {
        setForm({ id: null, nomeProd: '', categoria: '', valorProd: '', quantidade: '' }); // Limpa form
        setIsModalOpen(true);
    };

    const handleEditar = () => {
        if (!selectedId) return;
        const prod = produtos.find(p => p.idEstoque === selectedId);
        setForm({
            id: prod.idEstoque, // O backend usa o ID para atualizar se necessário
            nomeProd: prod.nomeProd || prod.nomeProd, // Ajuste conforme seu backend retorna
            valorProd: prod.valorProd || prod.valorProd,
            quantidade: prod.quantidade
        });
        setIsModalOpen(true);
    };

    const handleDeletar = async () => {
        if (!selectedId) return;
        if (window.confirm('Tem certeza que deseja deletar este produto?')) {
            await deletarProduto(selectedId);
            setSelectedId(null);
            carregar();
        }
    };

    // 3. Salvar (Submit do Modal)
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Converte para números
        const payload = {
            ...form,
            valorProd: parseFloat(form.valorProd),
            quantidade: parseFloat(form.quantidade)
        };
        
        await salvarProduto(payload);
        setIsModalOpen(false);
        carregar();
    };

    return (
        <div className="page-container">
            {/* --- HEADER DA PÁGINA (Figma) --- */}
            <div style={styles.headerRow}>
                <h1 style={{ fontSize: '48px' }}>Estoque</h1>
                
                <div style={styles.actions}>
                    <button onClick={handleAdicionar} className="btn-dark">Adicionar</button>
                    
                    <button 
                        onClick={handleEditar} 
                        className="btn-dark" 
                        disabled={!selectedId}
                        style={{ opacity: !selectedId ? 0.5 : 1 }}
                    >
                        Editar
                    </button>
                    
                    <button 
                        onClick={handleDeletar} 
                        className="btn-dark" 
                        disabled={!selectedId}
                        style={{ opacity: !selectedId ? 0.5 : 1 }}
                    >
                        Deletar
                    </button>
                </div>
            </div>

            {/* --- GRID DE PRODUTOS --- */}
            <div style={styles.grid}>
                {produtos.map(prod => (
                    <div 
                        key={prod.idEstoque} 
                        style={{
                            ...styles.card,
                            // Borda preta se selecionado, transparente se não
                            border: selectedId === prod.idEstoque ? '3px solid #000' : '3px solid transparent'
                        }}
                        onClick={() => setSelectedId(prod.idEstoque)}
                    >
                        <div style={styles.imagePlaceholder}>
                            <ImageIcon size={40} color="#333" />
                        </div>
                        
                        <div style={{ textAlign: 'center' }}>
                            <h3 style={styles.prodTitle}>{prod.nomeProd || prod.nomeProd}</h3>
                            <p style={styles.prodText}>Categoria: {prod.categoria}</p>
                            <p style={styles.prodText}>Valor: R$ {prod.valorProd || prod.valorProd}</p>
                            <p style={styles.prodText}>Qtd: {prod.quantidade}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- MODAL (OVERLAY) PARA ADICIONAR/EDITAR --- */}
            {isModalOpen && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h2>{form.id ? 'Editar Produto' : 'Adicionar Produto'}</h2>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none' }}>
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div>
                                <label style={styles.label}>Nome do Produto</label>
                                <input 
                                    style={styles.input} 
                                    value={form.nomeProd} 
                                    onChange={e => setForm({...form, nomeProd: e.target.value})} 
                                    required 
                                />
                            </div>
                            <div>
                                <label style={styles.label}>Categoria</label>
                                <input
                                    style={styles.input}
                                    value={form.categoria}
                                    onChange={e => setForm({ ...form, categoria: e.target.value })}
                                    required
                                />
                            </div>
                            
                            <div>
                                <label style={styles.label}>Quantidade em Estoque</label>
                                <input 
                                    type="number" 
                                    style={styles.input} 
                                    value={form.quantidade} 
                                    onChange={e => setForm({...form, quantidade: e.target.value})} 
                                    required 
                                />
                            </div>
                            <div>
                                <label style={styles.label}>Valor (R$)</label>
                                <input 
                                    type="number" step="0.01" 
                                    style={styles.input} 
                                    value={form.valorProd} 
                                    onChange={e => setForm({...form, valorProd: e.target.value})} 
                                    required 
                                />
                            </div>

                            <button type="submit" className="btn-dark" style={{ marginTop: '10px' }}>
                                Salvar
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Estilos baseados no seu Figma
const styles = {
    headerRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '40px',
        marginBottom: '40px'
    },
    actions: {
        display: 'flex',
        gap: '10px'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '30px'
    },
    card: {
        cursor: 'pointer',
        padding: '10px',
        borderRadius: '8px',
        transition: 'all 0.2s',
        backgroundColor: 'transparent' // O fundo cinza vem da página
    },
    imagePlaceholder: {
        width: '100%',
        height: '150px',
        backgroundColor: '#fff', // Fundo branco na imagem como no Figma
        border: '2px solid #333',
        borderRadius: '12px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '10px'
    },
    prodTitle: {
        fontSize: '16px',
        margin: '5px 0'
    },
    prodText: {
        margin: '2px 0',
        fontSize: '14px',
        color: '#333'
    },
    // Estilos do Modal
    modalOverlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        zIndex: 1000
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '10px',
        width: '400px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
    },
    input: {
        width: '100%',
        padding: '10px',
        borderRadius: '6px',
        border: '1px solid #ccc',
        boxSizing: 'border-box'
    },
    label: {
        fontWeight: 'bold',
        fontSize: '12px',
        marginBottom: '5px',
        display: 'block'
    }
};

export default EstoquePage;