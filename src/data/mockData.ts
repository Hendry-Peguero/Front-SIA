// Mock data para dropdowns
// Estos datos son temporales hasta que el backend tenga endpoints para obtenerlos

export const GRUPOS_MOCK = [
    { id: 1, nombre: 'ACCESORIOS DE CELULARES' },
    { id: 2, nombre: 'ELECTRÓNICA' },
    { id: 3, nombre: 'HOGAR Y COCINA' },
    { id: 4, nombre: 'ROPA Y CALZADO' },
    { id: 5, nombre: 'DEPORTES' },
    { id: 6, nombre: 'JUGUETES' },
    { id: 7, nombre: 'LIBROS Y PAPELERÍA' },
    { id: 8, nombre: 'BELLEZA Y CUIDADO PERSONAL' },
    { id: 9, nombre: 'ALIMENTOS Y BEBIDAS' },
    { id: 10, nombre: 'OTROS' },
];

export const ALMACENES_MOCK = [
    { id: 1, nombre: 'COLMADO LA UVA' },
    { id: 2, nombre: 'ALMACÉN CENTRAL' },
    { id: 3, nombre: 'ALMACÉN NORTE' },
    { id: 4, nombre: 'ALMACÉN SUR' },
    { id: 5, nombre: 'BODEGA PRINCIPAL' },
];

export const VAT_MOCK = [
    { id: 0, nombre: 'EXENTO', tasa: 0 },
    { id: 1, nombre: 'ITBIS 18%', tasa: 18 },
    { id: 2, nombre: 'ITBIS 16%', tasa: 16 },
    { id: 3, nombre: 'ITBIS 8%', tasa: 8 },
];

export const UNIDADES_MEDIDA_MOCK = [
    'Unidad',
    'Caja',
    'Paquete',
    'Kg',
    'Gramo',
    'Litro',
    'Metro',
    'Par',
    'Docena',
];
