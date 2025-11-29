import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/common/Layout';
import Dashboard from './pages/Dashboard';
import Movements from './pages/Movements';
import Items from './pages/Items';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import { ToastProvider } from './context/ToastContext';
import { InventoryProvider } from './context/InventoryContext';
import { ItemProvider } from './context/ItemContext';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

function App() {
    return (
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <ToastProvider>
                <Routes>
                    {/* Public Route */}
                    <Route path="/login" element={<Login />} />

                    {/* Protected Routes */}
                    <Route
                        path="/*"
                        element={
                            <ProtectedRoute>
                                <InventoryProvider>
                                    <ItemProvider>
                                        <Layout>
                                            <Routes>
                                                <Route path="/" element={<Dashboard />} />
                                                <Route path="/movements" element={<Movements />} />
                                                <Route path="/items" element={<Items />} />
                                                <Route path="*" element={<NotFound />} />
                                            </Routes>
                                        </Layout>
                                    </ItemProvider>
                                </InventoryProvider>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </ToastProvider>
        </BrowserRouter>
    );
}

export default App;
