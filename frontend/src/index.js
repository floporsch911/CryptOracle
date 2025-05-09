import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import HomePage from './pages/Homepage';
import CreatePage from './pages/CreatePage';
import ChartPage from './pages/ChartPage';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/createAccount" element={<CreatePage />} />
      <Route path="/chart" element={<ChartPage />} />
    </Routes>
  </BrowserRouter>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
