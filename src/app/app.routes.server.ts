import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    // Usamos solo renderizado en servidor (SSR) para todas las rutas.
    // Se desactiva el prerender por defecto para evitar errores
    // en rutas con parámetros dinámicos como admin/casos/:id.
    renderMode: RenderMode.Server,
  },
];
