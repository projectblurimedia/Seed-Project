import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Farmers } from './pages/farmers/Farmers'
import { Home } from './pages/home/Home'
import { CreateFarmer } from './pages/createFarmer/CreateFarmer'
import { CreateCrop } from './pages/createCrop/CreateCrop'
import { Login } from './pages/login/Login'
import { UpdateFarmer } from './pages/updateFarmer/UpdateFarmer'
import { UpdateCrop } from './pages/updateCrop/UpdateCrop'
import { Farmer } from './pages/farmer/Farmer'
import { Crop } from './pages/crop/Crop'
import { Transactions } from './pages/transactions/Transactions'
import { Crops } from './pages/crops/Crops'
import { SelectFarmer } from './pages/selectFarmer/SelectFarmer'

function App() {
  const [isAuth, setIsAuth] = useState(false)
  const [loading, setLoading] = useState(true)

  const axiosBaseUrl = 'http://localhost:8000/server'
  axios.defaults.baseURL = axiosBaseUrl

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token')
          setIsAuth(false)
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )

    return () => {
      axios.interceptors.request.eject(requestInterceptor)
      axios.interceptors.response.eject(responseInterceptor)
    }
  }, [])

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token')
      
      if (!token || token.trim() === '') {
        setIsAuth(false)
        setLoading(false)
        return
      }
      
      try {
        const parts = token.split('.')
        
        if (parts.length !== 3) {
          localStorage.removeItem('token')
          setIsAuth(false)
          setLoading(false)
          return
        }
        
        const payload = JSON.parse(atob(parts[1]))
        
        const isValid = payload.exp * 1000 > Date.now() - 60000
        
        setIsAuth(isValid)
        
        if (!isValid) {
          localStorage.removeItem('token')
        }
      } catch (error) {
        console.error('Token validation error:', error)
        localStorage.removeItem('token')
        setIsAuth(false)
      }
      setLoading(false)
    }

    checkAuth()
    
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        checkAuth()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        width: '100vw',
        fontSize: '18px',
        fontFamily: 'Poppins'
      }}>
        Loading...
      </div>
    )
  }

  return (
    <div 
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        width: '100vw',
        fontSize: '18px',
        fontFamily: 'Poppins'
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route 
            path="/login" 
            element={!isAuth ? <Navigate to="/" replace /> : <Login setIsAuth={setIsAuth} />} 
          />

          <Route
            path="/"
            element={!isAuth ? <Home setIsAuth={setIsAuth} /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/farmers"
            element={!isAuth ? <Farmers /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/select-farmer"
            element={!isAuth ? <SelectFarmer /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/crops"
            element={!isAuth ? <Crops /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/create-farmer"
            element={!isAuth ? <CreateFarmer /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/create-crop/:aadhar"
            element={!isAuth ? <CreateCrop /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/update-farmer/:aadhar"
            element={!isAuth ? <UpdateFarmer /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/update-crop/:id"
            element={!isAuth ? <UpdateCrop /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/farmers/:aadhar"
            element={!isAuth ? <Farmer /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/crops/:id"
            element={!isAuth ? <Crop /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/transactions"
            element={!isAuth ? <Transactions /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App