// /src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext'; // Importe o Provider

import Header from './components/Header';
import HomePage from './pages/HomePage';
import ProdutosPage from './pages/ProdutosPage';
import AgendamentoPage from './pages/AgendamentoPage';
import CheckoutPage from './pages/CheckoutPage';
import EstoquePage from './pages/EstoquePage';
// Se tiver EstoquePage, importe aqui também

import './App.css';

function App() {
  return (
    <CartProvider> {/* Contexto envolve tudo */}
        <Router>
            <div className="App">
                <Header /> {/* Header agora fica fixo e gerencia o carrinho */}
                
                <main>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/produtos" element={<ProdutosPage />} />
                        <Route path="/estoque" element={<EstoquePage />} />
                        <Route path="/agendamentos" element={<AgendamentoPage />} />
                        <Route path="/checkout/:idCarrinho" element={<CheckoutPage />} />
                        {/* Rota para estoque administrativo se tiver */}
                    </Routes>
                </main>
            </div>
        </Router>
    </CartProvider>
  );
}

export default App;