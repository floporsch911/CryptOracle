import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import HomePage from './pages/Homepage';
import CreateAccountPage from './pages/CreateAccountPage';
import AboutUsPage from './pages/AboutUsPage';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/PrivateRoute';
import ProfilPage from './pages/ProfilPage';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/createAccount" element={<CreateAccountPage />} />
      <Route path="/aboutUs" element={<AboutUsPage />} />
      <Route path="/main" element={<PrivateRoute><MainPage /></PrivateRoute>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/profil" element={<PrivateRoute><ProfilPage /></PrivateRoute>} />
    </Routes>
  </BrowserRouter>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
