import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CasosService } from '../../../core/services/casos.service';
import { SeguimientosService } from '../../../core/services/seguimientos.service';
import { Caso } from '../../../core/models/caso.model';

@Component({
  selector: 'app-admin-casos-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './casos-list.component.html',
  styleUrls: ['./casos-list.component.scss'],
})
export class AdminCasosListComponent implements OnInit {
  casos: Caso[] = [];
  casosFiltrados: Caso[] = [];
  casosPaginados: Caso[] = [];

  filtros = {
    numeroCaso: '',
    estado: '',
    dependencia: '',
    fechaDesde: '',
    fechaHasta: '',
  };

  isLoading = false;
  paginaActual = 1;
  itemsPorPagina = 10;
  totalPaginas = 1;
  rangoInicio = 0;
  rangoFin = 0;

  constructor(
    private casosService: CasosService,
    private seguimientosService: SeguimientosService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.cargarCasos();
  }

  cargarCasos(): void {
    this.isLoading = true;
    this.casosService.listarCasos().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.casos = response.data || [];
          this.aplicarFiltros();
        }
      },
      error: () => {
        this.isLoading = false;
        this.toastr.error('Error al cargar casos', 'Error');
      },
    });
  }

  aplicarFiltros(): void {
    this.casosFiltrados = this.casos.filter((caso) => {
      let cumpleFiltros = true;

      if (this.filtros.numeroCaso) {
        cumpleFiltros =
          cumpleFiltros &&
          caso.numeroCaso.toLowerCase().includes(this.filtros.numeroCaso.toLowerCase());
      }

      if (this.filtros.estado) {
        cumpleFiltros = cumpleFiltros && caso.estado === this.filtros.estado;
      }

      if (this.filtros.dependencia) {
        cumpleFiltros = cumpleFiltros && caso.dependencia === this.filtros.dependencia;
      }

      if (this.filtros.fechaDesde) {
        const fechaCaso = new Date(caso.fechaIngreso);
        const fechaDesde = new Date(this.filtros.fechaDesde);
        cumpleFiltros = cumpleFiltros && fechaCaso >= fechaDesde;
      }

      if (this.filtros.fechaHasta) {
        const fechaCaso = new Date(caso.fechaIngreso);
        const fechaHasta = new Date(this.filtros.fechaHasta);
        cumpleFiltros = cumpleFiltros && fechaCaso <= fechaHasta;
      }

      return cumpleFiltros;
    });

    this.paginaActual = 1;
    this.actualizarPaginacion();
  }

  limpiarFiltros(): void {
    this.filtros = {
      numeroCaso: '',
      estado: '',
      dependencia: '',
      fechaDesde: '',
      fechaHasta: '',
    };
    this.aplicarFiltros();
  }

  actualizarPaginacion(): void {
    this.totalPaginas = Math.max(1, Math.ceil(this.casosFiltrados.length / this.itemsPorPagina));
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.casosPaginados = this.casosFiltrados.slice(inicio, fin);

    this.rangoInicio = this.casosFiltrados.length > 0 ? inicio + 1 : 0;
    this.rangoFin = Math.min(fin, this.casosFiltrados.length);
  }

  siguientePagina(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.actualizarPaginacion();
    }
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.actualizarPaginacion();
    }
  }

  eliminarCaso(caso: Caso): void {
    if (confirm(`¿Está seguro de eliminar el caso ${caso.numeroCaso}?`)) {
      this.casosService.eliminarCaso(caso.idRegistro!).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('Caso eliminado correctamente', 'Éxito');
            this.cargarCasos();
          }
        },
        error: () => {
          this.toastr.error('Error al eliminar caso', 'Error');
        },
      });
    }
  }

  formatDate(date: string | Date): string {
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(
      2,
      '0'
    )}/${d.getFullYear()}`;
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'Pendiente':
        return 'bg-warning text-dark';
      case 'En Proceso':
        return 'bg-info text-white';
      case 'Finalizado':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  }

  getDependenciaClass(dependencia: string): string {
    switch (dependencia) {
      case 'COMISARIA':
        return 'bg-primary';
      case 'FISCALIA':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  }

  getUrgenciaClass(dias?: number): string {
    if (dias === undefined) return 'bg-secondary';
    if (dias < 0) return 'bg-danger';
    if (dias <= 3) return 'bg-danger';
    if (dias <= 7) return 'bg-warning text-dark';
    return 'bg-info text-white';
  }

  cambiarEstado(caso: Caso): void {
    const estadoActual = caso.estado;
    let nuevoEstado: string;

    if (estadoActual === 'Pendiente') {
      nuevoEstado = 'En Proceso';
    } else if (estadoActual === 'En Proceso') {
      nuevoEstado = 'Finalizado';
    } else {
      this.toastr.info('Este caso ya está finalizado', 'Información');
      return;
    }

    if (confirm(`¿Cambiar estado de "${estadoActual}" a "${nuevoEstado}"?`)) {
      const casoActualizado = {
        abogado: caso.abogado,
        patrocinado: caso.patrocinado,
        numeroCaso: caso.numeroCaso,
        fechaIngreso: caso.fechaIngreso,
        fechaVencimiento: caso.fechaVencimiento,
        tipoCaso: caso.tipoCaso,
        dependencia: caso.dependencia,
        opcionLlenado: caso.opcionLlenado || '',
        descripcion: caso.descripcion || '',
        estado: nuevoEstado,
      };

      this.casosService.actualizarCaso(caso.idRegistro!, casoActualizado).subscribe({
        next: (response) => {
          if (response.success) {
            // Crear seguimiento automático del cambio de estado
            const seguimientoCambioEstado = {
              idRegistro: caso.idRegistro!,
              tipoMovimiento: 'Cambio de Estado',
              descripcion: `Estado cambiado de "${estadoActual}" a "${nuevoEstado}" (Administrador)`,
            };

            this.seguimientosService.crearSeguimiento(seguimientoCambioEstado).subscribe({
              next: () => {
                this.toastr.success('Estado actualizado correctamente', 'Éxito');
                this.cargarCasos();
              },
              error: (error) => {
                console.error('Error al crear seguimiento:', error);
                this.toastr.success('Estado actualizado (sin registro en historial)', 'Éxito');
                this.cargarCasos();
              },
            });
          } else {
            this.toastr.error('Error al actualizar el estado', 'Error');
          }
        },
        error: (error) => {
          console.error('Error al actualizar estado:', error);
          this.toastr.error('Error al actualizar el estado', 'Error');
        },
      });
    }
  }
}
