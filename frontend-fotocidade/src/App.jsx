// /src/App.jsx

import React from 'react';
// 1. IMPORTE OS COMPONENTES DO REACT ROUTER DOM
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProdutosPage from './pages/ProdutosPage.jsx'; 
import CheckoutPage from './pages/CheckoutPage.jsx'; // Certifique-se de importar o CheckoutPage
import EstoquePage from './pages/EstoquePage.jsx';
import AgendamentoPage from './pages/AgendamentoPage.jsx';

function App() {
  return (
    // 2. ENVOLVA TUDO NO <Router>
    <Router>
      <div className="App">
        <header style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f0f0f0' }}>
          <h1>📸 FotoCidade E-commerce Admin</h1>
          <nav style={{ marginTop: '10px' }}>
            {/* Links de navegação para o usuário (opcional) */}
            <Link to="/" style={{ margin: '0 15px' }}>Produtos</Link>
            <Link to="/agendamentos" style={{ margin: '0 15px' }}>Agendamentos</Link>
            <Link to="/estoque" style={{ margin: '0 15px' }}>Estoque</Link>
          </nav>
        </header>
        
        <main>
          {/* 3. ONDE A MÁGICA ACONTECE: Renderiza o componente certo com base na URL */}
          <Routes>
            {/* Rota Inicial (URL: /) */}
            <Route path="/" element={<ProdutosPage />} />
            
            {/* Rota do Checkout (URL: /checkout/ID) */}
            <Route path="/checkout/:idCarrinho" element={<CheckoutPage />} />
            
            {/* Rota Placeholder */}
            <Route path="/agendamentos" element={<AgendamentoPage />} />

            {/* Rota Estoque (URL: /estoque) */}
            <Route path="/estoque" element={<EstoquePage />} />

          </Routes>
        </main>
        
        <footer style={{ textAlign: 'center', padding: '10px', marginTop: '20px', borderTop: '1px solid #ccc' }}>
            <p>&copy; 2025 FotoCidade</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;