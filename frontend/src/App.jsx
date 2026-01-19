import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import { useAuth } from './hooks/useAuth'

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route 
        path="/login" 
        element={!isAuthenticated() ? <Login /> : <Navigate to="/dashboard" />} 
      />
      <Route 
        path="/dashboard" 
        element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />} 
      />
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  )
}

export default App


