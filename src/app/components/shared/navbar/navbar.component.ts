import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div class="container-fluid">
        <!-- Logo y marca -->
        <a class="navbar-brand d-flex align-items-center" routerLink="/">
          <i class="pi pi-shield me-2" style="font-size: 1.5rem"></i>
          <span class="fw-bold">Sistema Judicial BCI</span>
        </a>

        <!-- Botón toggle para móvil -->
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Contenido del navbar -->
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto align-items-center">
            <!-- Notificaciones -->
            <li class="nav-item mx-2">
              <button type="button" class="btn btn-link text-white position-relative">
                <i class="bi bi-bell fs-5"></i>
                <span class="badge bg-danger">0</span>
              </button>
            </li>

            <!-- Usuario -->
            <li class="nav-item dropdown">
              <div class="d-flex align-items-center">
                <!-- Avatar y nombre -->
                <div class="d-flex align-items-center cursor-pointer dropdown-toggle" data-bs-toggle="dropdown">
                  <div class="avatar rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2" style="width: 40px; height: 40px;">
                    <span>{{ user?.nombreCompleto?.charAt(0) || 'U' }}</span>
                  </div>
                  <div class="d-none d-md-block">
                    <div class="text-white fw-semibold">{{ user?.nombreCompleto || 'Usuario' }}</div>
                    <div class="text-light small">{{ getRoleName(user?.rol) }}</div>
                  </div>
                  <i class="bi bi-chevron-down text-white ms-2"></i>
                </div>

                <!-- Menú desplegable -->
                <div class="dropdown-menu dropdown-menu-end">
                  <div class="p-3" style="min-width: 200px">
                    <!-- Información del usuario -->
                    <div class="mb-3">
                      <div class="fw-bold">{{ user?.nombreCompleto }}</div>
                      <div class="text-muted small">{{ user?.email }}</div>
                      <div class="badge bg-primary mt-1">{{ getRoleName(user?.rol) }}</div>
                    </div>

                    <hr class="my-2">

                    <!-- Opciones del menú -->
                    <div class="d-flex flex-column gap-2">
                      <button type="button" class="btn btn-link text-start text-decoration-none">
                        <i class="bi bi-person me-2"></i> Mi Perfil
                      </button>
                      
                      <button type="button" class="btn btn-link text-start text-decoration-none">
                        <i class="bi bi-gear me-2"></i> Configuración
                      </button>
                      
                      <hr class="my-1">
                      
                      <button type="button" class="btn btn-link text-start text-decoration-none text-danger" (click)="logout()">
                        <i class="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      height: 70px;
      padding: 0 20px;
    }
    
    .cursor-pointer {
      cursor: pointer;
    }
    
    .navbar-brand {
      font-size: 1.2rem;
    }
    
    @media (max-width: 768px) {
      .navbar {
        padding: 0 10px;
      }
    }
  `]
})
export class NavbarComponent implements OnInit {
  user: any = null;
  notificacionesCount = 3;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  getRoleName(role: string): string {
    switch(role) {
      case 'Admin': return 'Administrador';
      case 'Abogado': return 'Abogado';
      case 'Usuario': return 'Usuario';
      default: return 'Invitado';
    }
  }
}
