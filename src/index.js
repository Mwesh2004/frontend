import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import Admin from './Admin';
import LandingPage from './views/LandingPage';
import Pricing from './views/Pricing';
import Register from './views/Register';
import Billing from './views/Billing';
import Pharmacy from './views/Pharmacy';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<App />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/pharmacy" element={<Pharmacy />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);