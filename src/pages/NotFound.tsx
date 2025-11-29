import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Home, AlertCircle } from 'lucide-react';

const NotFound: React.FC = () => {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <Card className="w-full max-w-md">
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                        <div className="rounded-full bg-muted p-4 mb-4">
                            <AlertCircle className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h1 className="text-4xl font-bold mb-2">404</h1>
                        <h2 className="text-xl font-semibold mb-2">Página no encontrada</h2>
                        <p className="text-muted-foreground mb-6">
                            Lo sentimos, la página que buscas no existe o ha sido movida.
                        </p>
                        <Link to="/">
                            <Button>
                                <Home className="h-4 w-4 mr-2" />
                                Volver al Inicio
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default NotFound;
