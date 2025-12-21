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
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './mis-casos.component.html',
  styleUrls: ['./mis-casos.component.scss'],
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

  // Paginación
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 0;
  Math = Math;

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

    console.log('Usuario actual:', usuario); // Debug

    // Buscar casos del usuario
    this.casosService.listarCasos().subscribe({
      next: (response) => {
        console.log('Respuesta casos:', response); // Debug
        if (response.success && response.data) {
          // Filtrar casos según el rol
          const allCasos = Array.isArray(response.data) ? response.data : [];

          if (usuario.rol === 'Abogado' || usuario.rol === 'Admin') {
            // Abogados ven todos sus casos
            this.casos = allCasos.filter(
              (c: any) =>
                c.abogado && c.abogado.toLowerCase().includes(usuario.nombreCompleto.toLowerCase())
            );
          } else {
            // Usuarios ven casos donde son patrocinados
            this.casos = allCasos.filter(
              (c: any) =>
                c.patrocinado &&
                c.patrocinado.toLowerCase().includes(usuario.nombreCompleto.toLowerCase())
            );
          }

          console.log('Casos filtrados:', this.casos.length); // Debug
          this.filtrarCasosActivos();
          this.calcularEstadisticas();
          this.actualizarPaginacion();

          if (this.casos.length === 0) {
            this.toastr.info('No tienes casos asignados', 'Sin casos');
          }
        } else {
          this.casos = [];
          this.calcularEstadisticas();
          this.actualizarPaginacion();
          this.toastr.info('No hay casos disponibles', 'Sin casos');
        }
      },
      error: (error) => {
        console.error('Error al cargar casos:', error); // Debug
        this.casos = [];
        this.calcularEstadisticas();
        this.actualizarPaginacion();
        // No mostrar el error del backend al usuario en este caso
        this.toastr.warning(
          'No se pudieron cargar los casos. Intenta recargar la página.',
          'Advertencia'
        );
      },
    });
  }

  filtrarCasosActivos(): void {
    this.casosActivos = this.casos.filter((c) => c.estado !== 'Finalizado');
  }

  filtrarCasos(): void {
    if (!this.busqueda.trim()) {
      this.cargarMisCasos();
      return;
    }

    const term = this.busqueda.toLowerCase();
    this.casosActivos = this.casos.filter(
      (c) =>
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
    this.casosPendientes = this.casos.filter((c) => c.estado === 'Pendiente').length;
    this.casosEnProceso = this.casos.filter((c) => c.estado === 'En Proceso').length;
    this.casosFinalizados = this.casos.filter((c) => c.estado === 'Finalizado').length;
  }

  getEstadoSeverity(estado: string): 'success' | 'info' | 'danger' {
    switch (estado) {
      case 'Pendiente':
        return 'warn' as any;
      case 'En Proceso':
        return 'info';
      case 'Finalizado':
        return 'success';
      default:
        return 'info';
    }
  }

  getUrgenciaSeverity(urgencia: string): 'danger' | 'warn' | 'info' | 'success' {
    switch (urgencia) {
      case 'Vencido':
        return 'danger';
      case 'Urgente':
        return 'warn';
      case 'Próximo':
        return 'warn';
      case 'Normal':
        return 'success';
      default:
        return 'info';
    }
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'Pendiente':
        return 'bg-warning';
      case 'En Proceso':
        return 'bg-info';
      case 'Finalizado':
        return 'bg-success';
      case 'Rechazado':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  getUrgenciaClass(urgencia: string): string {
    switch (urgencia) {
      case 'Vencido':
        return 'bg-danger';
      case 'Urgente':
        return 'bg-warning';
      case 'Próximo':
        return 'bg-warning';
      case 'Normal':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  }
  get casosPaginados(): any[] {
    const inicio = (this.currentPage - 1) * this.itemsPerPage;
    const fin = inicio + this.itemsPerPage;
    return this.casos.slice(inicio, fin);
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPages) {
      this.currentPage = pagina;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  get paginasArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  actualizarPaginacion(): void {
    this.totalPages = Math.ceil(this.casos.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = 1;
    }
  }
}
