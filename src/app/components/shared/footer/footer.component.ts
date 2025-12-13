import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer mt-auto py-3 bg-light border-top">
      <div class="container-fluid">
        <div class="row align-items-center">
          <div class="col-md-6">
            <span class="text-muted">
              © {{ currentYear }} Sistema Judicial BCI. Todos los derechos reservados.
            </span>
          </div>
          <div class="col-md-6 text-end">
            <span class="text-muted small">
              Versión {{ version }} | Última actualización: {{ lastUpdate | date:'dd/MM/yyyy' }}
            </span>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      position: sticky;
      bottom: 0;
      z-index: 100;
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  version = '1.0.0';
  lastUpdate = new Date('2024-12-06');
}
