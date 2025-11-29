import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';
import Dashboard from './pages/Dashboard';
import Movements from './pages/Movements';
import NotFound from './pages/NotFound';
import { ToastProvider } from './context/ToastContext';
import { InventoryProvider } from './context/InventoryContext';

function App() {
    return (
        <BrowserRouter>
            <ToastProvider>
                <InventoryProvider>
                    <Layout>
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/movements" element={<Movements />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </Layout>
                </InventoryProvider>
            </ToastProvider>
        </BrowserRouter>
    );
}

export default App;
