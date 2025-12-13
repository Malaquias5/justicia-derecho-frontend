import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CasosService } from '../../../core/services/casos.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-mis-casos',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule],
  templateUrl: './mis-casos.component.html',
  styleUrls: ['./mis-casos.component.scss']
})
export class MisCasosComponent implements OnInit {
  casos: any[] = [];
  casosActivos: any[] = [];
  mostrarBusqueda = false;
  busqueda = '';
  
  totalCasos = 0;
  casosPendientes = 0;
  casosEnProceso = 0;
  casosFinalizados = 0;

  constructor(
    private casosService: CasosService,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarMisCasos();
  }

  cargarMisCasos(): void {
    const usuario = this.authService.getUser();
    if (!usuario) {
      this.router.navigate(['/auth/login']);
      return;
    }

    // En un sistema real, buscarías por patrocinado
    this.casosService.listarCasos().subscribe({
      next: (response) => {
        if (response.success) {
          // Filtrar casos del usuario actual (simulado)
          this.casos = response.data.filter((c: any) => 
            c.patrocinado.toLowerCase().includes(usuario.nombreCompleto.toLowerCase())
          );
          this.filtrarCasosActivos();
          this.calcularEstadisticas();
        }
      },
      error: (error) => {
        this.toastr.error('Error al cargar casos', 'Error');
      }
    });
  }

  filtrarCasosActivos(): void {
    this.casosActivos = this.casos.filter(c => 
      c.estado !== 'Finalizado'
    );
  }

  filtrarCasos(): void {
    if (!this.busqueda.trim()) {
      this.cargarMisCasos();
      return;
    }

    const term = this.busqueda.toLowerCase();
    this.casosActivos = this.casos.filter(c => 
      c.numeroCaso.toLowerCase().includes(term) ||
      c.abogado.toLowerCase().includes(term) ||
      c.tipoCaso.toLowerCase().includes(term)
    );
  }

  limpiarBusqueda(): void {
    this.busqueda = '';
    this.cargarMisCasos();
  }

  calcularEstadisticas(): void {
    this.totalCasos = this.casos.length;
    this.casosPendientes = this.casos.filter(c => c.estado === 'Pendiente').length;
    this.casosEnProceso = this.casos.filter(c => c.estado === 'En Proceso').length;
    this.casosFinalizados = this.casos.filter(c => c.estado === 'Finalizado').length;
  }

  getEstadoSeverity(estado: string): 'success' | 'info' | 'danger' {
    switch(estado) {
      case 'Pendiente': return 'warn' as any;
      case 'En Proceso': return 'info';
      case 'Finalizado': return 'success';
      default: return 'info';
    }
  }

  getUrgenciaSeverity(urgencia: string): 'danger' | 'warn' | 'info' | 'success' {
    switch (urgencia) {
      case 'Vencido': return 'danger';
      case 'Urgente': return 'warn';
      case 'Próximo': return 'warn';
      case 'Normal': return 'success';
      default: return 'info';
    }
  }

  getEstadoClass(estado: string): string {
    switch(estado) {
      case 'Pendiente': return 'bg-warning';
      case 'En Proceso': return 'bg-info';
      case 'Finalizado': return 'bg-success';
      case 'Rechazado': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  getUrgenciaClass(urgencia: string): string {
    switch (urgencia) {
      case 'Vencido': return 'bg-danger';
      case 'Urgente': return 'bg-warning';
      case 'Próximo': return 'bg-warning';
      case 'Normal': return 'bg-success';
      default: return 'bg-secondary';
    }
  }
}
