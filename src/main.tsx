import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

// Apply dark class before first paint to prevent flash
try {
  if (localStorage.getItem('civiclens_theme') === 'dark') {
    document.documentElement.classList.add('dark');
  }
} catch {
  // ignore
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
