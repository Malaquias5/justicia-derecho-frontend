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

  filtros = {
    numeroCaso: '',
    estado: '',
    dependencia: '',
    fechaDesde: null as Date | null,
    fechaHasta: null as Date | null,
  };

  totalCasos = 0;

  // Paginación
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;

  constructor(
    private casosService: CasosService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarCasos();
  }

  cargarCasos(): void {
    this.casosService.listarCasos().subscribe({
      next: (response) => {
        if (response.success) {
          this.casos = response.data || [];
          this.totalCasos = this.casos.length;
          this.actualizarPaginacion();

          if (this.casos.length === 0) {
            this.toastr.info('No tienes casos registrados aún', 'Sin casos');
          }
        } else {
          this.toastr.warning('No se pudieron cargar los casos', 'Advertencia');
          this.casos = [];
          this.totalCasos = 0;
          this.actualizarPaginacion();
        }
      },
      error: (error) => {
        console.error('Error al cargar casos:', error);
        this.toastr.error('Error al cargar casos', 'Error');
        this.casos = [];
        this.totalCasos = 0;
        this.actualizarPaginacion();
      },
    });
  }

  aplicarFiltros(): void {
    const hayFiltros =
      this.filtros.numeroCaso ||
      this.filtros.estado ||
      this.filtros.dependencia ||
      this.filtros.fechaDesde ||
      this.filtros.fechaHasta;

    if (!hayFiltros) {
      this.toastr.info('Por favor ingresa al menos un criterio de búsqueda', 'Búsqueda');
      this.cargarCasos();
      return;
    }

    this.casosService.buscarCasos(this.filtros).subscribe({
      next: (response) => {
        if (response.success) {
          this.casos = response.data || [];
          this.totalCasos = this.casos.length;
          this.actualizarPaginacion();
          this.currentPage = 1;

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
          this.totalCasos = 0;
          this.actualizarPaginacion();
        }
      },
      error: (error) => {
        console.error('Error al buscar:', error);
        this.toastr.error('Error al aplicar filtros', 'Error');
        this.casos = [];
        this.totalCasos = 0;
        this.actualizarPaginacion();
      },
    });
  }

  limpiarFiltros(): void {
    this.filtros = {
      numeroCaso: '',
      estado: '',
      dependencia: '',
      fechaDesde: null,
      fechaHasta: null,
    };
    this.currentPage = 1;
    this.cargarCasos();
    this.toastr.info('Filtros limpiados', 'Información');
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
      const casoActualizado = { ...caso, estado: nuevoEstado as any };
      
      this.casosService.actualizarCaso(caso.idRegistro, casoActualizado).subscribe({
        next: (response) => {
          this.toastr.success('Estado actualizado correctamente', 'Éxito');
          this.cargarCasos();
        },
        error: (error) => {
          console.error('Error al actualizar estado:', error);
          this.toastr.error('Error al actualizar el estado', 'Error');
        },
      });
    }
  }

  // Funciones de paginación
  getCasosPaginados(): Caso[] {
    const inicio = (this.currentPage - 1) * this.itemsPerPage;
    const fin = inicio + this.itemsPerPage;
    return this.casos.slice(inicio, fin);
  }

  actualizarPaginacion(): void {
    this.totalPages = Math.ceil(this.totalCasos / this.itemsPerPage);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = 1;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPages(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  getFirstItem(): number {
    return this.totalCasos === 0 ? 0 : (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getLastItem(): number {
    const last = this.currentPage * this.itemsPerPage;
    return Math.min(last, this.totalCasos);
  }

  // Funciones de formato
  formatDate(date: string | Date): string {
    if (!date) return '-';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  getDiasRestantesText(dias: number): string {
    if (dias < 0) {
      return `Vencido hace ${Math.abs(dias)} día(s)`;
    } else if (dias === 0) {
      return 'Vence hoy';
    } else if (dias === 1) {
      return 'Vence mañana';
    } else {
      return `${dias} día(s) restantes`;
    }
  }

  getDiasRestantesClass(dias: number): string {
    if (dias < 0) {
      return 'text-danger fw-bold';
    } else if (dias <= 3) {
      return 'text-danger fw-semibold';
    } else if (dias <= 7) {
      return 'text-warning fw-semibold';
    } else {
      return 'text-success';
    }
  }
}
