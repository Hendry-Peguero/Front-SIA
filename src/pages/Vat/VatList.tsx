import React, { useEffect, useState } from 'react';
import { getVats, VatDto } from '../../api/vatApi';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/button';
import { Percent, RefreshCw } from 'lucide-react';

const VatList: React.FC = () => {
    const [vats, setVats] = useState<VatDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { addToast } = useToast();

    useEffect(() => {
        loadVats();
    }, []);

    const loadVats = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getVats();
            setVats(data);
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message || 'Error al cargar tipos de impuestos';
            setError(errorMessage);
            addToast(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
                    <p className="text-muted-foreground">Cargando tipos de impuestos...</p>
                </div>
            </div>
        );
    }

    if (error && vats.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center max-w-md">
                    <div className="bg-destructive/10 text-destructive rounded-lg p-6 mb-4">
                        <h2 className="text-lg font-semibold mb-2">Error</h2>
                        <p className="text-sm">{error}</p>
                    </div>
                    <Button onClick={loadVats} variant="outline">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reintentar
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Tipos de Impuestos (VAT/ITBIS)
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Gestione los tipos de impuestos aplicables a los artículos
                    </p>
                </div>
                <Button disabled title="Pendiente de implementación en el backend">
                    <Percent className="mr-2 h-4 w-4" />
                    Nuevo Impuesto
                </Button>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 dark:bg-blue-950 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Nota:</strong> Los botones de crear, editar y eliminar están
                    deshabilitados porque el backend aún no implementa estos endpoints (solo GET).
                </p>
            </div>

            {/* Empty State */}
            {vats.length === 0 ? (
                <div className="flex items-center justify-center min-h-[300px] border-2 border-dashed rounded-lg">
                    <div className="text-center max-w-md px-4">
                        <Percent className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold mb-2">
                            No hay tipos de impuestos registrados
                        </h3>
                        <p className="text-muted-foreground text-sm">
                            Los impuestos se aplican automáticamente a los artículos según su
                            configuración.
                        </p>
                    </div>
                </div>
            ) : (
                /* Table */
                <div className="border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr className="border-b">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Descripción
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Porcentaje
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-background divide-y">
                                {vats.map((vat) => (
                                    <tr
                                        key={vat.id}
                                        className="hover:bg-muted/50 transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {vat.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {vat.descripcion}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                {vat.vat}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                                            <div className="flex items-center justify-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    disabled
                                                    title="Pendiente de implementación en el backend"
                                                >
                                                    Editar
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    disabled
                                                    title="Pendiente de implementación en el backend"
                                                >
                                                    Eliminar
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VatList;
