import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CasosService } from '../../../../core/services/casos.service';
import { Caso } from '../../../../core/models/caso.model';

@Component({
  selector: 'app-casos-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './casos-list.component.html',
  styleUrls: ['./casos-list.component.scss'],
})
export class CasosListComponent implements OnInit {
  casos: Caso[] = [];
  mostrarFiltros = false;

  filtros = {
    numeroCaso: '',
    estado: '',
    fechaDesde: null as Date | null,
    fechaHasta: null as Date | null,
  };

  estados = [
    { label: 'Todos', value: '' },
    { label: 'Pendiente', value: 'Pendiente' },
    { label: 'En Proceso', value: 'En Proceso' },
    { label: 'Finalizado', value: 'Finalizado' },
  ];

  totalCasos = 0;
  casosPendientes = 0;
  casosEnProceso = 0;
  casosFinalizados = 0;

  // Paginación
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;
  Math = Math;

  constructor(
    private casosService: CasosService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarCasos();
  }

  cargarCasos(): void {
    console.log('Cargando casos...'); // Debug
    this.casosService.listarCasos().subscribe({
      next: (response) => {
        console.log('Respuesta casos:', response); // Debug
        if (response.success) {
          this.casos = response.data || [];
          this.calcularEstadisticas();
          console.log('Casos cargados:', this.casos.length); // Debug

          if (this.casos.length === 0) {
            this.toastr.info('No tienes casos registrados aún', 'Sin casos');
          }
        } else {
          this.toastr.warning('No se pudieron cargar los casos', 'Advertencia');
          this.casos = [];
          this.calcularEstadisticas();
        }
      },
      error: (error) => {
        console.error('Error al cargar casos:', error); // Debug
        this.toastr.error('Error al cargar casos. Por favor, recarga la página.', 'Error');
        this.casos = []; // Asegurar que esté vacío
        this.calcularEstadisticas();
      },
    });
  }

  aplicarFiltros(): void {
    console.log('Aplicando filtros:', this.filtros); // Debug

    // Verificar si hay al menos un filtro aplicado
    const hayFiltros =
      this.filtros.numeroCaso ||
      this.filtros.estado ||
      this.filtros.fechaDesde ||
      this.filtros.fechaHasta;

    if (!hayFiltros) {
      this.toastr.info('Por favor ingresa al menos un criterio de búsqueda', 'Búsqueda');
      this.cargarCasos();
      return;
    }

    this.casosService.buscarCasos(this.filtros).subscribe({
      next: (response) => {
        console.log('Respuesta búsqueda:', response); // Debug
        if (response.success) {
          this.casos = response.data || [];
          this.calcularEstadisticas();

          if (this.casos.length === 0) {
            this.toastr.warning(
              'No se encontraron casos con los criterios especificados',
              'Sin resultados'
            );
          } else {
            this.toastr.success(
              `Se encontraron ${this.casos.length} caso(s)`,
              'Búsqueda completada'
            );
          }
        } else {
          this.toastr.warning('La búsqueda no retornó resultados', 'Sin resultados');
          this.casos = [];
          this.calcularEstadisticas();
        }
      },
      error: (error) => {
        console.error('Error al buscar:', error); // Debug
        this.toastr.error('Error al aplicar filtros. Intenta con otros criterios.', 'Error');
        this.casos = [];
        this.calcularEstadisticas();
      },
    });
  }

  limpiarFiltros(): void {
    this.filtros = {
      numeroCaso: '',
      estado: '',
      fechaDesde: null,
      fechaHasta: null,
    };
    this.cargarCasos();
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
        return 'bg-warning text-dark';
      case 'En Proceso':
        return 'bg-info';
      case 'Finalizado':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  }

  getUrgenciaClass(urgencia: string): string {
    switch (urgencia) {
      case 'Vencido':
        return 'bg-danger';
      case 'Urgente':
        return 'bg-warning text-dark';
      case 'Próximo':
        return 'bg-warning text-dark';
      case 'Normal':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  }

  eliminarCaso(caso: Caso): void {
    if (confirm(`¿Está seguro de eliminar el caso ${caso.numeroCaso}?`)) {
      this.casosService.eliminarCaso(caso.idRegistro).subscribe({
        next: (response) => {
          this.toastr.success('Caso eliminado exitosamente', 'Éxito');
          this.cargarCasos();
        },
        error: (error) => {
          const errorMessage = error.error?.message || 'Error al eliminar caso';
          this.toastr.error(errorMessage, 'Error');
        },
      });
    }
  }

  get casosPaginados(): Caso[] {
    const inicio = (this.currentPage - 1) * this.itemsPerPage;
    const fin = inicio + this.itemsPerPage;
    return this.casos.slice(inicio, fin);
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPages) {
      this.currentPage = pagina;
    }
  }

  get paginasArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  actualizarPaginacion(): void {
    this.totalPages = Math.ceil(this.casos.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
  }
}
