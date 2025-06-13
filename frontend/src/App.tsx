import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Auth/Login';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Products from './pages/Products';
import POS from './pages/POS';
import Sales from './pages/Sales';
import Suppliers from './pages/Suppliers';
import Categories from './pages/Categories';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard\" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Manager only routes */}
            <Route path="users" element={
              <ProtectedRoute allowedRoles={['GERENTE']}>
                <Users />
              </ProtectedRoute>
            } />
            <Route path="suppliers" element={
              <ProtectedRoute allowedRoles={['GERENTE', 'ESTOQUISTA']}>
                <Suppliers />
              </ProtectedRoute>
            } />
            <Route path="categories" element={
              <ProtectedRoute allowedRoles={['GERENTE']}>
                <Categories />
              </ProtectedRoute>
            } />
            
            {/* Manager and Stock Clerk routes */}
            <Route path="products" element={
              <ProtectedRoute allowedRoles={['GERENTE', 'ESTOQUISTA']}>
                <Products />
              </ProtectedRoute>
            } />
            
            {/* Cashier specific route */}
            <Route path="pos" element={
              <ProtectedRoute allowedRoles={['CAIXA']}>
                <POS />
              </ProtectedRoute>
            } />
            
            {/* Sales - accessible by Manager and Cashier */}
            <Route path="sales" element={
              <ProtectedRoute allowedRoles={['GERENTE', 'CAIXA']}>
                <Sales />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;