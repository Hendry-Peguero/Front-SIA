import React from 'react';
import { useNavigate } from 'react-router';
import { useInventory } from '../context/InventoryContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Package, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

const Dashboard: React.FC = () => {
    const { movements } = useInventory();
    const navigate = useNavigate();

    const entradas = movements.filter((m) => m.movementType.toLowerCase() === 'entrada');
    const salidas = movements.filter((m) => m.movementType.toLowerCase() === 'salida');
    const ajustes = movements.filter((m) => m.movementType.toLowerCase() === 'ajuste');

    const stats = [
        {
            title: 'Entradas',
            value: entradas.length,
            icon: TrendingUp,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-100',
        },
        {
            title: 'Salidas',
            value: salidas.length,
            icon: TrendingDown,
            color: 'text-red-600',
            bgColor: 'bg-red-100',
        },
        {
            title: 'Ajustes',
            value: ajustes.length,
            icon: AlertTriangle,
            color: 'text-amber-600',
            bgColor: 'bg-amber-100',
        },
        {
            title: 'Total Movimientos',
            value: movements.length,
            icon: Package,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
        },
    ];

    const recentMovements = movements.slice(0, 5);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Sistema de Inventario</h1>
                <p className="text-muted-foreground mt-1">
                    Resumen del sistema de inventario
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <div className={`${stat.bgColor} p-2 rounded-lg`}>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Movements */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Movimientos Recientes</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            Últimos 5 movimientos registrados
                        </p>
                    </div>
                    <Button onClick={() => navigate('/movements')}>
                        Ver Todos
                    </Button>
                </CardHeader>
                <CardContent>
                    {recentMovements.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                            No hay movimientos registrados
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {recentMovements.map((movement) => (
                                <div
                                    key={movement.movementId}
                                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="font-mono text-sm text-muted-foreground">
                                            #{movement.movementId}
                                        </div>
                                        <div>
                                            <p className="font-medium">Producto #{movement.itemId}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {movement.movementType} - {movement.quantity} unidades
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => navigate('/movements')}
                                    >
                                        Ver
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Dashboard;
