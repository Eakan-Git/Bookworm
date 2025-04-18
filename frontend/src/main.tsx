import './i18n';
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx'
import MainLayout from '@layouts/MainLayout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <MainLayout>
          <App />
        </MainLayout>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
