import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-seguimiento',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="seguimiento-container p-4">
      <div class="mb-4">
        <h2 class="h4 mb-2">
          <i class="bi bi-clock-history me-2 text-primary"></i>Seguimiento de Casos
        </h2>
        <p class="text-muted mb-0">Historial y actualizaciones de tus casos</p>
      </div>

      <!-- Mensaje informativo -->
      <div class="alert alert-info border-0 shadow-sm">
        <div class="d-flex align-items-start">
          <i class="bi bi-info-circle-fill me-3" style="font-size: 1.5rem;"></i>
          <div>
            <h6 class="alert-heading mb-2">Vista del Seguimiento</h6>
            <p class="mb-2">En esta sección podrás ver todas las actualizaciones de tus casos.</p>
            <p class="mb-0"><strong>Para ver el seguimiento de un caso específico:</strong></p>
            <ol class="mb-0 mt-2">
              <li>Ve a <strong>"Mis Casos"</strong></li>
              <li>Haz clic en <strong>"Ver Detalles"</strong> del caso que deseas consultar</li>
              <li>Allí encontrarás el historial completo de movimientos y actualizaciones</li>
            </ol>
          </div>
        </div>
      </div>

      <!-- Ejemplo visual -->
      <div class="card border-0 shadow-sm">
        <div class="card-header bg-white border-bottom">
          <h5 class="mb-0">
            <i class="bi bi-list-ul me-2"></i>Actualizaciones Recientes (Ejemplo)
          </h5>
        </div>
        <div class="card-body">
          <div class="timeline">
            <div class="timeline-item">
              <div class="timeline-marker bg-success"></div>
              <div class="timeline-content">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <h6 class="mb-0">Caso registrado en el sistema</h6>
                  <small class="text-muted">Hace 5 días</small>
                </div>
                <p class="text-muted small mb-1">Tu caso ha sido registrado exitosamente.</p>
                <small class="text-muted">Por: Dr. Juan Pérez</small>
              </div>
            </div>

            <div class="timeline-item">
              <div class="timeline-marker bg-info"></div>
              <div class="timeline-content">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <h6 class="mb-0">Documentos solicitados</h6>
                  <small class="text-muted">Hace 3 días</small>
                </div>
                <p class="text-muted small mb-1">Se han solicitado documentos adicionales para tu caso.</p>
                <small class="text-muted">Por: Sistema</small>
              </div>
            </div>

            <div class="timeline-item">
              <div class="timeline-marker bg-primary"></div>
              <div class="timeline-content">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <h6 class="mb-0">Próxima audiencia programada</h6>
                  <small class="text-muted">Hace 1 día</small>
                </div>
                <p class="text-muted small mb-1">Audiencia programada para el 25 de diciembre.</p>
                <small class="text-muted">Por: Dr. Juan Pérez</small>
              </div>
            </div>
          </div>

          <div class="text-center mt-4">
            <p class="text-muted mb-3">Para ver el seguimiento real de tus casos</p>
            <button class="btn btn-primary" routerLink="/usuario/mis-casos">
              <i class="bi bi-folder me-2"></i>Ir a Mis Casos
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .seguimiento-container {
      animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .timeline {
      position: relative;
      padding-left: 30px;
    }

    .timeline-item {
      position: relative;
      padding-bottom: 30px;
    }

    .timeline-item:last-child {
      padding-bottom: 0;
    }

    .timeline-marker {
      position: absolute;
      left: -30px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      top: 5px;
    }

    .timeline-item::before {
      content: '';
      position: absolute;
      left: -25px;
      top: 17px;
      width: 2px;
      height: calc(100% + 13px);
      background: #dee2e6;
    }

    .timeline-item:last-child::before {
      display: none;
    }

    .timeline-content {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      border-left: 3px solid #0d6efd;
    }
  `]
})
export class SeguimientoComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {}
}
