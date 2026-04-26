import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Admin from './Admin';

const root = ReactDOM.createRoot(document.getElementById('root'));
const isAdmin = window.location.pathname === '/admin';
root.render(isAdmin ? <Admin /> : <App />);