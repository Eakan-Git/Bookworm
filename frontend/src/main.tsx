import './i18n';
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx'
import MainLayout from '@layouts/MainLayout';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <MainLayout>
        <App />
      </MainLayout>
    </BrowserRouter>
  </StrictMode>,
)
