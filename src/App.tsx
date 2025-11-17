import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import { loginRequest } from './auth/authConfig'

// Components
import Login from './components/Login'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Prodotti from './pages/Prodotti'
import Movimenti from './pages/Movimenti'
import Inventario from './pages/Inventario'
import Laboratori from './pages/Laboratori'
import Scanner from './pages/Scanner'
import TestCosmosDB from './components/TestCosmosDB'

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  const isAuthenticated = useIsAuthenticated()
  const { instance } = useMsal()

  const handleLogin = () => {
    instance.loginPopup(loginRequest).catch(e => {
      console.error('Errore di login:', e)
    })
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/prodotti" element={<Prodotti />} />
            <Route path="/movimenti" element={<Movimenti />} />
            <Route path="/inventario" element={<Inventario />} />
            <Route path="/laboratori" element={<Laboratori />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/test-db" element={<TestCosmosDB />} />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  )
}

export default App