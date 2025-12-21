import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ayuda',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ayuda-container p-4">
      <div class="mb-4">
        <h2 class="h4 mb-2">
          <i class="bi bi-question-circle me-2 text-success"></i>Centro de Ayuda
        </h2>
        <p class="text-muted mb-0">Encuentra respuestas a tus preguntas y aprende a usar el sistema</p>
      </div>
      
      <!-- Tarjetas de ayuda -->
      <div class="row g-4 mb-4">
        <div class="col-md-6">
          <div class="card border-0 shadow-sm h-100 help-card">
            <div class="card-body text-center p-4">
              <div class="mb-3">
                <i class="bi bi-book text-primary" style="font-size: 3rem;"></i>
              </div>
              <h5 class="card-title">Guía de Usuario</h5>
              <p class="text-muted mb-3">Manual completo del sistema</p>
              <button class="btn btn-outline-primary btn-sm" disabled>
                <i class="bi bi-file-earmark-pdf me-2"></i>Descargar PDF
              </button>
            </div>
          </div>
        </div>
        
        <div class="col-md-6">
          <div class="card border-0 shadow-sm h-100 help-card">
            <div class="card-body text-center p-4">
              <div class="mb-3">
                <i class="bi bi-play-circle text-danger" style="font-size: 3rem;"></i>
              </div>
              <h5 class="card-title">Tutoriales</h5>
              <p class="text-muted mb-3">Videos explicativos paso a paso</p>
              <button class="btn btn-outline-danger btn-sm" disabled>
                <i class="bi bi-youtube me-2"></i>Ver Videos
              </button>
            </div>
          </div>
        </div>
        
        <div class="col-md-6">
          <div class="card border-0 shadow-sm h-100 help-card">
            <div class="card-body text-center p-4">
              <div class="mb-3">
                <i class="bi bi-chat-dots text-success" style="font-size: 3rem;"></i>
              </div>
              <h5 class="card-title">Preguntas Frecuentes</h5>
              <p class="text-muted mb-3">Respuestas a dudas comunes</p>
              <button class="btn btn-outline-success btn-sm" disabled>
                <i class="bi bi-patch-question me-2"></i>Ver FAQs
              </button>
            </div>
          </div>
        </div>
        
        <div class="col-md-6">
          <div class="card border-0 shadow-sm h-100 help-card">
            <div class="card-body text-center p-4">
              <div class="mb-3">
                <i class="bi bi-envelope text-warning" style="font-size: 3rem;"></i>
              </div>
              <h5 class="card-title">Contacto</h5>
              <p class="text-muted mb-3">Comunícate con soporte técnico</p>
              <button class="btn btn-outline-warning btn-sm" disabled>
                <i class="bi bi-envelope me-2"></i>Contactar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Información de contacto -->
      <div class="card border-0 shadow-sm">
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <h5 class="mb-3">
                <i class="bi bi-info-circle text-info me-2"></i>Información de Contacto
              </h5>
              <ul class="list-unstyled">
                <li class="mb-2">
                  <i class="bi bi-envelope-fill text-primary me-2"></i>
                  <strong>Email:</strong> soporte@sistemajudicial.com
                </li>
                <li class="mb-2">
                  <i class="bi bi-telephone-fill text-success me-2"></i>
                  <strong>Teléfono:</strong> (123) 456-7890
                </li>
                <li class="mb-2">
                  <i class="bi bi-clock-fill text-warning me-2"></i>
                  <strong>Horario:</strong> Lunes a Viernes, 8:00 AM - 6:00 PM
                </li>
              </ul>
            </div>
            <div class="col-md-6">
              <h5 class="mb-3">
                <i class="bi bi-lightbulb text-warning me-2"></i>Consejos Rápidos
              </h5>
              <ul class="list-unstyled">
                <li class="mb-2">✓ Mantén tus datos actualizados</li>
                <li class="mb-2">✓ Revisa tus casos regularmente</li>
                <li class="mb-2">✓ Sube documentos claros y legibles</li>
                <li class="mb-2">✓ Atiende las notificaciones a tiempo</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ayuda-container {
      animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .help-card {
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: pointer;
    }

    .help-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15) !important;
    }

    .help-card h5 {
      color: #495057;
      font-weight: 600;
    }

    .alert {
      border-radius: 8px;
      border-left: 4px solid #0dcaf0;
    }
  `]
})
export class AyudaComponent implements OnInit {
  
  constructor() {}

  ngOnInit(): void {
    console.log('Componente Ayuda cargado');
  }
}
