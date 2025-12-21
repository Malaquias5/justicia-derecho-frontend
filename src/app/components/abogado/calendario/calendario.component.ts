import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="calendario-container">
      <div class="mb-4">
        <h2 class="h4 mb-2">Calendario de Audiencias</h2>
        <p class="text-muted">Gestiona tus fechas importantes y audiencias</p>
      </div>

      <div class="card">
        <div class="card-body text-center py-5">
          <i class="bi bi-calendar-event" style="font-size: 4rem; color: #6c757d;"></i>
          <h5 class="mt-3">Calendario en Desarrollo</h5>
          <p class="text-muted">
            Esta funcionalidad estará disponible próximamente.<br>
            Podrás gestionar audiencias, plazos y fechas importantes.
          </p>
        </div>
      </div>

      <!-- Vista previa de próximas audiencias -->
      <div class="row mt-4">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h6 class="mb-0">Próximas Audiencias</h6>
            </div>
            <div class="card-body">
              <p class="text-muted text-center py-3">
                <i class="bi bi-calendar-check me-2"></i>
                No hay audiencias programadas
              </p>
            </div>
          </div>
        </div>
        
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h6 class="mb-0">Vencimientos Próximos</h6>
            </div>
            <div class="card-body">
              <p class="text-muted text-center py-3">
                <i class="bi bi-clock-history me-2"></i>
                No hay vencimientos próximos
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .calendario-container {
      padding: 1.5rem;
    }

    .card {
      border-radius: 0.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  `]
})
export class CalendarioComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    // Futuro: cargar audiencias y vencimientos
  }
}
