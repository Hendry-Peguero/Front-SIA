import React, { useEffect, useState } from 'react';
import { getItemGroups, ItemGroupDto } from '../../api/itemGroupApi';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/button';
import { Folder, RefreshCw } from 'lucide-react';

const ItemGroupList: React.FC = () => {
    const [groups, setGroups] = useState<ItemGroupDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { addToast } = useToast();

    useEffect(() => {
        loadGroups();
    }, []);

    const loadGroups = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getItemGroups();
            setGroups(data);
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message || 'Error al cargar grupos de artículos';
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
                    <p className="text-muted-foreground">Cargando grupos de artículos...</p>
                </div>
            </div>
        );
    }

    if (error && groups.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center max-w-md">
                    <div className="bg-destructive/10 text-destructive rounded-lg p-6 mb-4">
                        <h2 className="text-lg font-semibold mb-2">Error</h2>
                        <p className="text-sm">{error}</p>
                    </div>
                    <Button onClick={loadGroups} variant="outline">
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
                    <h1 className="text-3xl font-bold tracking-tight">Grupos de Artículos</h1>
                    <p className="text-muted-foreground mt-1">
                        Gestione las categorías de artículos del inventario
                    </p>
                </div>
                <Button disabled title="Pendiente de implementación en el backend">
                    <Folder className="mr-2 h-4 w-4" />
                    Nuevo Grupo
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
            {groups.length === 0 ? (
                <div className="flex items-center justify-center min-h-[300px] border-2 border-dashed rounded-lg">
                    <div className="text-center max-w-md px-4">
                        <Folder className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold mb-2">
                            No hay grupos de artículos registrados
                        </h3>
                        <p className="text-muted-foreground text-sm">
                            Los grupos permiten categorizar los artículos del inventario.
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
                                        Nombre del Grupo
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-background divide-y">
                                {groups.map((group) => (
                                    <tr
                                        key={group.GROUP_ID}
                                        className="hover:bg-muted/50 transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {group.GROUP_ID}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {group.GROUP_NAME}
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

export default ItemGroupList;
