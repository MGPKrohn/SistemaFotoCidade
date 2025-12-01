import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartOverlay = () => {
    const { isCartOpen, carrinho, toggleCart, limparCarrinho } = useCart();
    const navigate = useNavigate();

    if (!isCartOpen) return null;

    const handleCheckout = () => {
        toggleCart(); // Fecha overlay
        navigate(`/checkout/${carrinho.idCarrinho}`);
    };

    return (
        <div style={styles.overlayContainer}>
            {/* Triângulo apontando para o ícone (Opcional, estilo balão) */}
            <div style={styles.triangle}></div>

            <div style={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ShoppingBag size={20} />
                    <span style={{ fontWeight: 'bold' }}>Carrinho</span>
                </div>
                <button onClick={toggleCart} style={{ background: 'none', border: 'none' }}><X size={20}/></button>
            </div>

            <div style={styles.body}>
                {!carrinho ? (
                    <p style={{ color: '#999', textAlign: 'center' }}>Carrinho vazio</p>
                ) : (
                    <>
                        <p style={{ fontSize: '0.9em', color: '#666' }}>ID Carrinho: #{carrinho.idCarrinho}</p>
                        
                        <div style={styles.itemsList}>
                            {carrinho.itens.map((item, idx) => (
                                <div key={idx} style={styles.item}>
                                    <span>{item.quantItem}x {item.estoque.nome_prod}</span>
                                    <strong>R$ {(item.quantItem * item.precoUnit).toFixed(2)}</strong>
                                </div>
                            ))}
                        </div>

                        <div style={styles.totalSection}>
                            <span>Total:</span>
                            <span style={{ color: '#28a745' }}>R$ {carrinho.precototal}</span>
                        </div>

                        <div style={styles.actions}>
                            <button onClick={handleCheckout} className="btn-dark" style={{ width: '100%' }}>
                                Checkout
                            </button>
                            <button onClick={limparCarrinho} className="btn-light" style={{ width: '100%', border: 'none', color: 'red' }}>
                                Cancelar Compra
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const styles = {
    overlayContainer: {
        position: 'absolute', top: '70px', right: '40px', width: '300px',
        backgroundColor: '#FFFFFF', boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        borderRadius: '8px', zIndex: 1000, padding: '20px'
    },
    header: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px' },
    itemsList: { maxHeight: '200px', overflowY: 'auto', margin: '10px 0', borderTop: '1px solid #eee' },
    item: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee', fontSize: '0.9em' },
    totalSection: { display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', margin: '15px 0', fontSize: '1.1em' },
    actions: { display: 'flex', flexDirection: 'column', gap: '10px' }
};

export default CartOverlay;