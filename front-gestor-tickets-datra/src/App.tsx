import { Suspense } from 'react';
import AppRoutes from './router/AppRoutes';

/**
 * Root component de la aplicación
 * - No define rutas
 * - No contiene lógica de auth
 * - Solo compone la app
 */
export default function App() {
  return (
    <Suspense fallback={<div>Cargando aplicación...</div>}>
      <AppRoutes />
    </Suspense>
  );
}
