import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { ThemeContextProvider } from '../theme/ThemeContext';

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ThemeContextProvider>
        <App />
      </ThemeContextProvider>
    </React.StrictMode>
  );
}
