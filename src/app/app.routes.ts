import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // Auth Routes
  {
    path: 'auth',
    loadComponent: () =>
      import('./components/auth/layout/auth-layout.component.js').then(
        (m) => m.AuthLayoutComponent
      ),
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./components/auth/login/login.component').then((m) => m.LoginComponent),
        title: 'Iniciar Sesión',
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./components/auth/register/register.component.js').then(
            (m) => m.RegisterComponent
          ),
        title: 'Registrarse',
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },

  // Admin Routes
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin'] },
    loadComponent: () =>
      import('./components/admin/layout/admin-layout.component').then(
        (m) => m.AdminLayoutComponent
      ),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./components/admin/dashboard/admin-dashboard.component').then(
            (m) => m.AdminDashboardComponent
          ),
        title: 'Dashboard Admin',
      },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./components/admin/usuarios/usuarios-list.component').then(
            (m) => m.UsuariosListComponent
          ),
        title: 'Gestión de Usuarios',
      },
      {
        path: 'estadisticas',
        loadComponent: () =>
          import('./components/admin/estadisticas/estadisticas.component').then(
            (m) => m.EstadisticasComponent
          ),
        title: 'Estadísticas',
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  // Abogado Routes
  {
    path: 'abogado',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Abogado', 'Admin'] },
    loadComponent: () =>
      import('./components/abogado/layout/abogado-layout.component').then(
        (m) => m.AbogadoLayoutComponent
      ),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./components/abogado/dashboard/abogado-dashboard.component').then(
            (m) => m.AbogadoDashboardComponent
          ),
        title: 'Dashboard Abogado',
      },
      {
        path: 'casos',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./components/abogado/casos/list/casos-list.component').then(
                (m) => m.CasosListComponent
              ),
            title: 'Mis Casos',
          },
          {
            path: 'nuevo',
            loadComponent: () =>
              import('./components/abogado/casos/create/caso-create.component').then(
                (m) => m.CasoCreateComponent
              ),
            title: 'Nuevo Caso',
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./components/abogado/casos/detail/caso-detail.component').then(
                (m) => m.CasoDetailComponent
              ),
            title: 'Detalle del Caso',
          },
          {
            path: 'editar/:id',
            loadComponent: () =>
              import('./components/abogado/casos/edit/caso-edit.component').then(
                (m) => m.CasoEditComponent
              ),
            title: 'Editar Caso',
          },
        ],
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  // Usuario Routes
  {
    path: 'usuario',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/usuario/layout/usuario-layout.component').then(
        (m) => m.UsuarioLayoutComponent
      ),
    children: [
      {
        path: 'mis-casos',
        loadComponent: () =>
          import('./components/usuario/mis-casos/mis-casos.component').then(
            (m) => m.MisCasosComponent
          ),
        title: 'Mis Casos',
      },
      {
        path: 'caso/:id',
        loadComponent: () =>
          import('./components/abogado/casos/detail/caso-detail.component').then(
            (m) => m.CasoDetailComponent
          ),
        title: 'Detalle del Caso',
      },
      { path: '', redirectTo: 'mis-casos', pathMatch: 'full' },
    ],
  },

  // Default Routes
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/auth/login' },
];