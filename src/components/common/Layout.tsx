import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Menu, X, LogOut, Folder, Percent } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from '../ui/button';
import { Modal } from '../ui/modal';
import { useAuth } from '../../context/AuthContext';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { userName, logout } = useAuth();

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleLogoutClick = () => {
        setIsLogoutModalOpen(true);
    };

    const confirmLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        {
            label: 'Dashboard',
            href: '/',
            icon: LayoutDashboard,
        },
        {
            label: 'Artículos',
            href: '/items',
            icon: ShoppingBag,
        },
        {
            label: 'Movimientos',
            href: '/movements',
            icon: Package,
        },

    ];

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="mr-2 md:hidden"
                            onClick={toggleSidebar}
                        >
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle Menu</span>
                        </Button>
                        <div className="mr-4 flex">
                            <Link to="/" className="mr-6 flex items-center space-x-2">
                                <Package className="h-6 w-6 text-primary" />
                                <span className="hidden font-bold sm:inline-block">
                                    Sistema de Inventario
                                </span>
                            </Link>
                        </div>
                    </div>

                    {/* User Info and Logout */}
                    <div className="flex items-center gap-2">
                        <span className="hidden sm:inline text-sm text-muted-foreground">
                            {userName || 'Usuario'}
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLogoutClick}
                            className="gap-2"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="hidden sm:inline">Cerrar Sesión</span>
                        </Button>
                    </div>
                </div>
            </header>

            <div className="flex-1 container flex-col md:flex-row flex gap-6 py-6">
                {/* Sidebar (Desktop) */}
                <aside className="hidden w-[200px] flex-col md:flex">
                    <nav className="grid items-start gap-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={cn(
                                    "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                                    location.pathname === item.href ? "bg-accent text-accent-foreground" : "transparent"
                                )}
                            >
                                <item.icon className="mr-2 h-4 w-4" />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </aside>

                {/* Mobile Sidebar */}
                {isSidebarOpen && (
                    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden">
                        <div className="fixed inset-y-0 left-0 z-50 h-full w-3/4 border-r bg-background p-6 shadow-lg sm:max-w-sm">
                            <div className="flex items-center justify-between mb-6">
                                <Link to="/" className="flex items-center space-x-2" onClick={toggleSidebar}>
                                    <Package className="h-6 w-6" />
                                    <span className="font-bold">Sistema de Inventario</span>
                                </Link>
                                <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                            <nav className="grid gap-2">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        to={item.href}
                                        onClick={toggleSidebar}
                                        className={cn(
                                            "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                                            location.pathname === item.href ? "bg-accent text-accent-foreground" : "transparent"
                                        )}
                                    >
                                        <item.icon className="mr-2 h-4 w-4" />
                                        <span>{item.label}</span>
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <main className="flex-1">
                    {children}
                </main>
            </div>

            {/* Logout Confirmation Modal */}
            <Modal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                title="Cerrar Sesión"
                description="¿Seguro que quiere cerrar sesión?"
            >
                <div className="flex justify-end gap-3 pt-2">
                    <Button
                        variant="outline"
                        onClick={() => setIsLogoutModalOpen(false)}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={confirmLogout}
                    >
                        Cerrar Sesión
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default Layout;
