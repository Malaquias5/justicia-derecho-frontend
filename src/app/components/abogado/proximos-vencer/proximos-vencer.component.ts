import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CasosService } from '../../../core/services/casos.service';
import { Caso } from '../../../core/models/caso.model';
import { take, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-proximos-vencer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './proximos-vencer.component.html',
  styleUrls: ['./proximos-vencer.component.scss'],
})
export class ProximosVencerComponent implements OnInit {

  casos: Caso[] = [];
  casosPaginados: Caso[] = [];

  diasSeleccionados = 15;
  isLoading = false;

  paginaActual = 1;
  itemsPorPagina = 5;
  totalPaginas = 1;

  constructor(
    private casosService: CasosService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarCasosProximos();
  }

  cargarCasosProximos(): void {
    this.isLoading = true;
    console.log('Cargando casos próximos a vencer...');
    
    this.casosService.listarCasos()
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          console.log('Finalize: loading detenido');
        })
      )
      .subscribe({
        next: (response) => {
          console.log('Respuesta del servicio:', response);
          
          if (response && response.success) {
            // Filtrar casos según los días seleccionados
            const todosCasos = response.data || [];
            console.log('Total de casos recibidos:', todosCasos.length);
            
            if (this.diasSeleccionados === 9999) {
              // Mostrar todos
              this.casos = todosCasos;
            } else {
              // Filtrar por días
              this.casos = todosCasos.filter(caso => {
                const dias = caso.diasRestantes ?? 999;
                return dias <= this.diasSeleccionados || dias < 0;
              });
            }
            
            console.log('Casos filtrados:', this.casos.length);
            
            this.paginaActual = 1;
            this.totalPaginas = Math.max(1, Math.ceil(this.casos.length / this.itemsPorPagina));
            console.log('Total de páginas calculadas:', this.totalPaginas);
            
            this.actualizarCasosPaginados();

            if (this.casos.length === 0) {
              this.toastr.info(
                `No se encontraron casos próximos a vencer en ${this.diasSeleccionados} días.`,
                'Sin casos urgentes'
              );
            }
          } else {
            this.casos = [];
            this.casosPaginados = [];
            this.totalPaginas = 1;
            this.toastr.error('No se pudo obtener la lista de casos', 'Error');
          }
        },
        error: (err) => {
          console.error('Error al cargar casos:', err);
          this.casos = [];
          this.casosPaginados = [];
          this.totalPaginas = 1;
          this.toastr.error('Error al cargar casos: ' + (err.message || 'Error desconocido'), 'Error');
        }
      });
  }

  actualizarCasosPaginados(): void {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.casosPaginados = this.casos.slice(inicio, fin);
    console.log('Paginación actualizada:', {
      paginaActual: this.paginaActual,
      totalPaginas: this.totalPaginas,
      totalCasos: this.casos.length,
      casosPaginados: this.casosPaginados.length,
      inicio,
      fin
    });
  }

  siguientePagina(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.actualizarCasosPaginados();
    }
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.actualizarCasosPaginados();
    }
  }

  cambiarFiltro(dias: number): void {
    this.diasSeleccionados = dias;
    this.paginaActual = 1;
    this.cargarCasosProximos();
  }

  verTodos(): void {
    this.router.navigate(['/abogado/casos']);
  }

  getNivelUrgenciaClass(dias?: number): string {
    if (dias === undefined) return 'bg-secondary';
    if (dias <= 3) return 'bg-danger';
    if (dias <= 7) return 'bg-warning text-dark';
    return 'bg-success';
  }

  getNivelUrgenciaTexto(dias?: number): string {
    if (dias === undefined) return 'Sin definir';
    if (dias < 0) return 'VENCIDO';
    if (dias === 0) return 'VENCE HOY';
    if (dias <= 3) return 'URGENTE';
    if (dias <= 7) return 'PRÓXIMO';
    return 'NORMAL';
  }

  getDiasRestantesTexto(dias?: number): string {
    if (dias === undefined) return '-';
    if (dias < 0) return `Vencido hace ${Math.abs(dias)} día(s)`;
    if (dias === 0) return 'Vence hoy';
    if (dias === 1) return 'Vence mañana';
    return `${dias} día(s) restantes`;
  }

  formatDate(date: string | Date): string {
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'Pendiente': return 'bg-warning text-dark';
      case 'En Proceso': return 'bg-info';
      case 'Finalizado': return 'bg-success';
      default: return 'bg-secondary';
    }
  }
}
