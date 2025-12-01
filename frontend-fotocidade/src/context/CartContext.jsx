import React, { createContext, useState, useEffect, useContext } from 'react';
import { criarNovoCarrinho, adicionarItemAoCarrinho, buscarCarrinho } from '../services/CarrinhoService';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [carrinhoId, setCarrinhoId] = useState(null);
    const [carrinho, setCarrinho] = useState(null);
    const [isCartOpen, setIsCartOpen] = useState(false); // Controla o Overlay

    // Carrega carrinho salvo ao iniciar
    useEffect(() => {
        const idSalvo = localStorage.getItem('meuCarrinhoId');
        if (idSalvo) {
            buscarCarrinho(idSalvo)
                .then(dados => {
                    if (!dados.checkout) {
                        setCarrinhoId(idSalvo);
                        setCarrinho(dados);
                    } else {
                        localStorage.removeItem('meuCarrinhoId');
                    }
                })
                .catch(() => localStorage.removeItem('meuCarrinhoId'));
        }
    }, []);

    const criarCarrinho = async () => {
        const novo = await criarNovoCarrinho();
        setCarrinhoId(novo.idCarrinho);
        setCarrinho(novo);
        localStorage.setItem('meuCarrinhoId', novo.idCarrinho);
        return novo;
    };

    const adicionarItem = async (idEstoque, quantidade) => {
        let idAtual = carrinhoId;
        if (!idAtual) {
            const novo = await criarCarrinho();
            idAtual = novo.idCarrinho;
        }
        const atualizado = await adicionarItemAoCarrinho(idAtual, idEstoque, quantidade);
        setCarrinho(atualizado);
        setIsCartOpen(true); // Abre o carrinho automaticamente ao adicionar
    };

    const limparCarrinho = () => {
        localStorage.removeItem('meuCarrinhoId');
        setCarrinhoId(null);
        setCarrinho(null);
        setIsCartOpen(false);
    };

    const toggleCart = () => setIsCartOpen(!isCartOpen);

    return (
        <CartContext.Provider value={{ 
            carrinhoId, carrinho, isCartOpen, 
            criarCarrinho, adicionarItem, limparCarrinho, toggleCart 
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);