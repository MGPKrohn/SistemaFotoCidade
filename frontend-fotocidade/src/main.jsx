// /src/index.jsx (ou main.jsx)

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter as Router } from 'react-router-dom'; // Importe AQUI

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  
      <App />
  
  </React.StrictMode>,
);