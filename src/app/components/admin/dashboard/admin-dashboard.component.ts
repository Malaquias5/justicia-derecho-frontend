import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CasosService } from '../../../core/services/casos.service';
import { UsuariosService } from '../../../core/services/usuarios.service';
import { Caso } from '../../../core/models/caso.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  
  totalUsuarios = 0;
  totalAbogados = 0;
  totalCasos = 0;
  casosFinalizados = 0;
  casosUrgentes: Caso[] = [];
  distribucionDependencia: any[] = [];
  fechaActual: string = '';

  constructor(
    private readonly casosService: CasosService,
    private readonly usuariosService: UsuariosService,
    private readonly toastr: ToastrService,
    private readonly router: Router
  ) {
    this.fechaActual = new Date().toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  ngOnInit(): void {
    this.loadStats();
  }

  private loadStats(): void {
    forkJoin({
      casos: this.casosService.listarCasos(),
      usuarios: this.usuariosService.listarUsuarios(),
    }).subscribe({
      next: (responses) => {
        // Procesar usuarios
        if (responses.usuarios.success && responses.usuarios.data) {
          const usuarios = responses.usuarios.data;
          this.totalUsuarios = usuarios.filter((u: any) => u.rol === 'Usuario').length;
          this.totalAbogados = usuarios.filter((u: any) => u.rol === 'Abogado').length;
        }

        // Procesar casos
        if (responses.casos.success && responses.casos.data) {
          const casos = responses.casos.data;
          this.totalCasos = casos.length;
          this.casosFinalizados = casos.filter(c => c.estado === 'Finalizado').length;
          
          // Casos urgentes (próximos a vencer en 7 días o menos)
          this.casosUrgentes = casos
            .filter(c => c.diasRestantes !== undefined && c.diasRestantes <= 7 && c.diasRestantes >= 0)
            .sort((a, b) => (a.diasRestantes || 0) - (b.diasRestantes || 0))
            .slice(0, 5);

          // Calcular distribución por dependencia
          this.calcularDistribucionDependencia(casos);
        }
      },
      error: () => {
        this.toastr.error('Error al cargar estadísticas', 'Error');
      }
    });
  }

  private calcularDistribucionDependencia(casos: Caso[]): void {
    const dependencias: { [key: string]: number } = {};
    
    casos.forEach(caso => {
      if (caso.dependencia) {
        dependencias[caso.dependencia] = (dependencias[caso.dependencia] || 0) + 1;
      }
    });

    const total = casos.length;
    this.distribucionDependencia = Object.keys(dependencias).map(nombre => ({
      nombre,
      cantidad: dependencias[nombre],
      porcentaje: total > 0 ? Math.round((dependencias[nombre] / total) * 100) : 0,
      class: nombre === 'COMISARIA' ? 'bg-primary' : 'bg-success'
    }));
  }

  verFinalizados(): void {
    this.router.navigate(['/admin/casos'], { 
      queryParams: { estado: 'Finalizado' } 
    });
  }

  formatDate(date: string | Date): string {
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  }
}
