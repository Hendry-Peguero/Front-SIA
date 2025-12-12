import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';
import Dashboard from './pages/Dashboard';
import Movements from './pages/Movements';
import Items from './pages/Items';
import ItemGroupList from './pages/ItemGroups';
import VatList from './pages/Vat';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { InventoryProvider } from './context/InventoryContext';
import { ItemProvider } from './context/ItemContext';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
    return (
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AuthProvider>
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
                                                    <Route path="/catalogs/item-groups" element={<ItemGroupList />} />
                                                    <Route path="/catalogs/vat" element={<VatList />} />
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
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
