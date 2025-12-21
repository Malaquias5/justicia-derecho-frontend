import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="configuracion-container p-4">
      <div class="mb-4">
        <h2 class="h4 mb-2">
          <i class="bi bi-gear me-2 text-secondary"></i>Configuración
        </h2>
        <p class="text-muted mb-0">Información de tu cuenta</p>
      </div>

      <!-- Información del usuario -->
      <div class="row">
        <div class="col-md-8">
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-header bg-white border-bottom">
              <h5 class="mb-0">
                <i class="bi bi-person-circle me-2"></i>Información Personal
              </h5>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label text-muted small">Nombre Completo</label>
                  <div class="fw-semibold">{{ usuario?.nombreCompleto || 'No disponible' }}</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label text-muted small">Usuario</label>
                  <div class="fw-semibold">{{ usuario?.usuario || 'No disponible' }}</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label text-muted small">Email</label>
                  <div class="fw-semibold">{{ usuario?.email || 'No disponible' }}</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label text-muted small">Rol</label>
                  <div>
                    <span class="badge bg-primary">{{ usuario?.rol || 'No disponible' }}</span>
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label text-muted small">Estado de Cuenta</label>
                  <div>
                    <span class="badge" [class.bg-success]="usuario?.activo" [class.bg-secondary]="!usuario?.activo">
                      {{ usuario?.activo ? 'Activa' : 'Inactiva' }}
                    </span>
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label text-muted small">Fecha de Registro</label>
                  <div class="fw-semibold">{{ usuario?.fechaCreacion | date:'dd/MM/yyyy' }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Opciones de configuración -->
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-bottom">
              <h5 class="mb-0">
                <i class="bi bi-sliders me-2"></i>Preferencias
              </h5>
            </div>
            <div class="card-body">
              <div class="alert alert-warning border-0">
                <div class="d-flex align-items-start">
                  <i class="bi bi-exclamation-triangle-fill me-3" style="font-size: 1.5rem;"></i>
                  <div>
                    <h6 class="alert-heading mb-2">Funcionalidad en desarrollo</h6>
                    <p class="mb-0 small">Próximamente podrás:</p>
                    <ul class="mb-0 mt-2 small">
                      <li>Cambiar tu contraseña</li>
                      <li>Actualizar tu información de contacto</li>
                      <li>Configurar notificaciones por email</li>
                      <li>Establecer preferencias del sistema</li>
                      <li>Gestionar tu privacidad</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Panel lateral -->
        <div class="col-md-4">
          <div class="card border-0 shadow-sm mb-3">
            <div class="card-body text-center">
              <div class="mb-3">
                <i class="bi bi-person-circle" style="font-size: 5rem; color: #6c757d;"></i>
              </div>
              <h5>{{ usuario?.nombreCompleto }}</h5>
              <p class="text-muted mb-0">{{ usuario?.rol }}</p>
            </div>
          </div>

          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-bottom">
              <h6 class="mb-0">
                <i class="bi bi-shield-check me-2"></i>Seguridad
              </h6>
            </div>
            <div class="card-body">
              <div class="d-grid gap-2">
                <button class="btn btn-outline-primary" disabled>
                  <i class="bi bi-key me-2"></i>Cambiar Contraseña
                </button>
                <button class="btn btn-outline-secondary" disabled>
                  <i class="bi bi-shield-lock me-2"></i>Privacidad
                </button>
              </div>
              <small class="text-muted d-block mt-2">Funciones en desarrollo</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .configuracion-container {
      animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .card {
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
    }

    ul {
      padding-left: 1.5rem;
    }

    li {
      margin-bottom: 0.5rem;
    }
  `]
})
export class ConfiguracionComponent implements OnInit {
  usuario: any = null;
  
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUser();
  }
}
