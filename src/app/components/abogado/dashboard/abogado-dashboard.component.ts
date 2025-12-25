import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CasosService } from '../../../core/services/casos.service';
import { AuthService } from '../../../core/services/auth.service';
import { Caso } from '../../../core/models/caso.model';

@Component({
  selector: 'app-abogado-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './abogado-dashboard.component.html',
  styleUrls: ['./abogado-dashboard.component.scss'],
})
export class AbogadoDashboardComponent implements OnInit {
  user: any = null;
  casos: Caso[] = [];
  casosUrgentes: Caso[] = [];

  // Estadísticas
  totalCasos = 0;
  casosPendientes = 0;
  casosEnProceso = 0;
  casosFinalizados = 0;

  // Distribución por dependencia
  casosComisaria = 0;
  casosFiscalia = 0;
  porcentajeComisaria = 0;
  porcentajeFiscalia = 0;

  constructor(
    private authService: AuthService,
    private casosService: CasosService,
    private toastr: ToastrService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.cargarCasos();
  }

  cargarCasos(): void {
    this.casosService.listarCasos().subscribe({
      next: (response) => {
        if (response.success) {
          this.casos = response.data || [];
          this.calcularEstadisticas();
          this.calcularDistribucionDependencia();
          this.filtrarCasosUrgentes();
          this.cd.detectChanges();
        }
      },
      error: (error) => {
        console.error('Error al cargar casos:', error);
        this.toastr.error('Error al cargar casos', 'Error');
      },
    });
  }

  calcularEstadisticas(): void {
    this.totalCasos = this.casos.length;
    this.casosPendientes = this.casos.filter((c) => c.estado === 'Pendiente').length;
    this.casosEnProceso = this.casos.filter((c) => c.estado === 'En Proceso').length;
    this.casosFinalizados = this.casos.filter((c) => c.estado === 'Finalizado').length;
  }

  calcularDistribucionDependencia(): void {
    this.casosComisaria = this.casos.filter((c) => c.dependencia === 'COMISARIA').length;
    this.casosFiscalia = this.casos.filter((c) => c.dependencia === 'FISCALIA').length;

    if (this.totalCasos > 0) {
      this.porcentajeComisaria = Math.round((this.casosComisaria / this.totalCasos) * 100);
      this.porcentajeFiscalia = Math.round((this.casosFiscalia / this.totalCasos) * 100);
    } else {
      this.porcentajeComisaria = 0;
      this.porcentajeFiscalia = 0;
    }
  }

  filtrarCasosUrgentes(): void {
    // Casos próximos a vencer (15 días o menos) y no finalizados
    this.casosUrgentes = this.casos
      .filter((c) => {
        if (c.diasRestantes === undefined) return false;
        return c.diasRestantes <= 15 && c.estado !== 'Finalizado';
      })
      .sort((a, b) => {
        const diasA = a.diasRestantes ?? 999;
        const diasB = b.diasRestantes ?? 999;
        return diasA - diasB;
      })
      .slice(0, 5); // Mostrar máximo 5
  }

  filtrarPorEstado(estado: string): void {
    this.router.navigate(['/abogado/casos'], {
      queryParams: { estado: estado },
    });
  }

  buscarCasos(): void {
    this.router.navigate(['/abogado/casos']);
  }

  formatDate(date: string | Date): string {
    if (!date) return '-';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  getDiasSeverity(dias: number): 'danger' | 'warn' | 'info' {
    if (dias <= 3) return 'danger';
    if (dias <= 7) return 'warn';
    return 'info';
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'Pendiente':
        return 'bg-warning text-dark';
      case 'En Proceso':
        return 'bg-info';
      case 'Finalizado':
        return 'bg-success';
      case 'Archivado':
        return 'bg-secondary';
      default:
        return 'bg-secondary';
    }
  }
}
