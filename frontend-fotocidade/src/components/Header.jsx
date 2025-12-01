import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Aperture } from 'lucide-react'; // Ícones
import { useCart } from '../context/CartContext';
import CartOverlay from './CartOverlay';

const Header = () => {
    const { toggleCart, carrinho } = useCart();

    return (
        <div style={{ position: 'relative' }}>
            <header style={styles.header}>
                {/* Logo Esquerda */}
                <div style={styles.logoSection}>
                    <Aperture size={32} color="#000" />
                    <Link to="/" style={styles.logoText}>Foto Cidade</Link>
                </div>

                {/* Menu Central/Direita */}
                <nav style={styles.nav}>
                    <Link to="/produtos" style={styles.link}>Produtos</Link>
                    <Link to="/estoque" style={styles.link}>Estoque</Link>
                    <Link to="/agendamentos" style={styles.link}>Agendamento</Link>
                    
                    {/* Botão Carrinho */}
                    <button onClick={toggleCart} style={styles.cartBtn}>
                        <ShoppingCart size={24} />
                        {carrinho?.itens?.length > 0 && (
                            <span style={styles.badge}></span>
                        )}
                    </button>
                </nav>
            </header>
            
            {/* O Overlay do Carrinho vive aqui */}
            <CartOverlay />
        </div>
    );
};

const styles = {
    header: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 40px', backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E5E5E5'
    },
    logoSection: { display: 'flex', alignItems: 'center', gap: '10px' },
    logoText: { fontSize: '24px', fontWeight: 'bold', textDecoration: 'none', color: '#000' },
    nav: { display: 'flex', alignItems: 'center', gap: '30px' },
    link: { textDecoration: 'none', color: '#333', fontWeight: '500' },
    cartBtn: { background: 'none', border: 'none', position: 'relative', cursor: 'pointer' },
    badge: {
        position: 'absolute', top: -2, right: -2, width: '10px', height: '10px',
        backgroundColor: '#007bff', borderRadius: '50%'
    }
};

export default Header;