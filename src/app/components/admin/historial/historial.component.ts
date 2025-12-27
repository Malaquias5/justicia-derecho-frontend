import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SeguimientosService } from '../../../core/services/seguimientos.service';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse } from '../../../core/models/api-response.model';

interface Cambio {
  id: number;
  fecha: Date;
  usuario: string;
  rol: string;
  accion: string;
  entidad: string;
  detalle: string;
  ip?: string;
}

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="historial-container p-4">
      <!-- Header -->
      <div class="mb-4">
        <h2 class="h4 mb-2">
          <i class="bi bi-clock-history me-2 text-primary"></i>Historial de Cambios
        </h2>
        <p class="text-muted mb-0">Registro completo de todas las acciones realizadas en el sistema</p>
      </div>

      <!-- Filtros -->
      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-3">
              <label class="form-label small">Tipo de Acción</label>
              <select class="form-select" [(ngModel)]="filtroAccion" (change)="aplicarFiltros()">
                <option value="">Todas</option>
                <option value="Seguimiento">Seguimientos de Casos</option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label small">Entidad</label>
              <select class="form-select" [(ngModel)]="filtroEntidad" (change)="aplicarFiltros()">
                <option value="">Todas</option>
                <option value="Seguimiento">Seguimientos</option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label small">Usuario</label>
              <input 
                type="text" 
                class="form-control" 
                [(ngModel)]="filtroUsuario"
                (input)="aplicarFiltros()"
                placeholder="Buscar por usuario...">
            </div>
            <div class="col-md-3">
              <label class="form-label small">Fecha</label>
              <input 
                type="date" 
                class="form-control" 
                [(ngModel)]="filtroFecha"
                (change)="aplicarFiltros()">
            </div>
          </div>
        </div>
      </div>

      <!-- Estadísticas rápidas -->
      <div class="row mb-4">
        <div class="col-md-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h3 class="display-6 fw-bold text-primary mb-1">{{ cambiosHoy }}</h3>
                  <p class="text-muted mb-0 small">Cambios Hoy</p>
                </div>
                <i class="bi bi-calendar-day text-primary" style="font-size: 2.5rem; opacity: 0.2;"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h3 class="display-6 fw-bold text-success mb-1">{{ cambiosSemana }}</h3>
                  <p class="text-muted mb-0 small">Última Semana</p>
                </div>
                <i class="bi bi-calendar-week text-success" style="font-size: 2.5rem; opacity: 0.2;"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h3 class="display-6 fw-bold text-info mb-1">{{ usuariosActivos }}</h3>
                  <p class="text-muted mb-0 small">Usuarios Activos</p>
                </div>
                <i class="bi bi-people text-info" style="font-size: 2.5rem; opacity: 0.2;"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h3 class="display-6 fw-bold text-warning mb-1">{{ cambiosCriticos }}</h3>
                  <p class="text-muted mb-0 small">Cambios Críticos</p>
                </div>
                <i class="bi bi-exclamation-triangle text-warning" style="font-size: 2.5rem; opacity: 0.2;"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla de historial -->
      <div class="card border-0 shadow-sm">
        <div class="card-header bg-white border-bottom">
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
              <i class="bi bi-list-ul me-2"></i>Registro de Actividades
            </h5>
            <button type="button" class="btn btn-sm btn-outline-primary">
              <i class="bi bi-download me-2"></i>Exportar
            </button>
          </div>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th>Fecha y Hora</th>
                  <th>Usuario</th>
                  <th>Rol</th>
                  <th>Acción</th>
                  <th>Entidad</th>
                  <th>Detalle</th>
                  <th>IP</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let cambio of cambiosPaginados">
                  <td>
                    <div class="fw-semibold">{{ cambio.fecha | date:'dd/MM/yyyy' }}</div>
                    <small class="text-muted">{{ cambio.fecha | date:'HH:mm:ss' }}</small>
                  </td>
                  <td>
                    <div class="d-flex align-items-center">
                      <i class="bi bi-person-circle me-2 text-primary"></i>
                      {{ cambio.usuario }}
                    </div>
                  </td>
                  <td>
                    <span class="badge" [ngClass]="getRolClass(cambio.rol)">
                      {{ cambio.rol }}
                    </span>
                  </td>
                  <td>
                    <span class="badge" [ngClass]="getAccionClass(cambio.accion)">
                      <i [class]="getAccionIcon(cambio.accion)" class="me-1"></i>
                      {{ cambio.accion }}
                    </span>
                  </td>
                  <td>{{ cambio.entidad }}</td>
                  <td>
                    <small class="text-muted">{{ cambio.detalle }}</small>
                  </td>
                  <td>
                    <small class="text-muted font-monospace">{{ cambio.ip || 'N/A' }}</small>
                  </td>
                </tr>
                <tr *ngIf="cambiosFiltrados.length === 0">
                  <td colspan="7" class="text-center py-4">
                    <i class="bi bi-inbox me-2"></i>
                    No se encontraron registros
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="card-footer bg-white border-top" *ngIf="cambiosFiltrados.length > 0">
          <div class="d-flex justify-content-between align-items-center">
            <div class="text-muted small">
              Mostrando {{ (currentPage - 1) * itemsPerPage + 1 }} - 
              {{ Math.min(currentPage * itemsPerPage, cambiosFiltrados.length) }} de {{ cambiosFiltrados.length }} registros
            </div>
            <nav>
              <ul class="pagination pagination-sm mb-0">
                <li class="page-item" [class.disabled]="currentPage === 1">
                  <button type="button" class="page-link" (click)="cambiarPagina(currentPage - 1)">
                    <i class="bi bi-chevron-left"></i>
                  </button>
                </li>
                <li class="page-item" *ngFor="let p of paginasArray" [class.active]="p === currentPage">
                  <button type="button" class="page-link" (click)="cambiarPagina(p)">{{ p }}</button>
                </li>
                <li class="page-item" [class.disabled]="currentPage === totalPages">
                  <button type="button" class="page-link" (click)="cambiarPagina(currentPage + 1)">
                    <i class="bi bi-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .historial-container {
      animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .table tbody tr {
      transition: background-color 0.2s;
    }

    .table tbody tr:hover {
      background-color: #f8f9fa;
    }

    .font-monospace {
      font-family: 'Courier New', monospace;
      font-size: 0.85rem;
    }
  `]
})
export class HistorialComponent implements OnInit {
  cambios: Cambio[] = [];
  cambiosFiltrados: Cambio[] = [];
  
  // Filtros
  filtroAccion = '';
  filtroEntidad = '';
  filtroUsuario = '';
  filtroFecha = '';

  // Estadísticas
  cambiosHoy = 0;
  cambiosSemana = 0;
  usuariosActivos = 0;
  cambiosCriticos = 0;

  // Paginación
  currentPage = 1;
  itemsPerPage = 15;
  totalPages = 0;
  Math = Math;

  constructor(
    private seguimientosService: SeguimientosService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    this.seguimientosService.listarMisSeguimientos().subscribe({
      next: (response: ApiResponse<any>) => {
        if (response.success && response.data) {
          this.cambios = response.data.map((seg: any, index: number) => ({
            id: seg.idSeguimiento ?? index + 1,
            fecha: new Date(seg.fechaSeguimiento),
            usuario: seg.usuarioRegistro || seg.usuario || 'Desconocido',
            rol: 'Abogado',
            accion: 'Seguimiento',
            entidad: 'Seguimiento',
            detalle: `${seg.tipoMovimiento || 'Movimiento'} en el caso ${seg.numeroCaso || 'N/A'}: ${seg.descripcion || ''}`,
            ip: undefined,
          }));

          this.cambios.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
          this.cambiosFiltrados = [...this.cambios];
          this.calcularEstadisticas();
          this.actualizarPaginacion();
        } else {
          this.cambios = [];
          this.cambiosFiltrados = [];
          this.calcularEstadisticas();
          this.actualizarPaginacion();
        }
      },
      error: (error: any) => {
        console.error('Error al cargar historial de cambios:', error);
        this.toastr.error('Error al cargar el historial de cambios', 'Error');
        this.cambios = [];
        this.cambiosFiltrados = [];
        this.calcularEstadisticas();
        this.actualizarPaginacion();
      },
    });
  }

  calcularEstadisticas(): void {
    const ahora = new Date();
    const hoyInicio = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
    const semanaAtras = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000);

    this.cambiosHoy = this.cambios.filter(c => c.fecha >= hoyInicio).length;
    this.cambiosSemana = this.cambios.filter(c => c.fecha >= semanaAtras).length;
    this.usuariosActivos = new Set(this.cambios.map(c => c.usuario)).size;
    this.cambiosCriticos = this.cambios.filter(c => c.accion === 'Eliminar').length;
  }

  aplicarFiltros(): void {
    this.cambiosFiltrados = this.cambios.filter(cambio => {
      const matchAccion = !this.filtroAccion || cambio.accion === this.filtroAccion;
      const matchEntidad = !this.filtroEntidad || cambio.entidad === this.filtroEntidad;
      const matchUsuario = !this.filtroUsuario || 
        cambio.usuario.toLowerCase().includes(this.filtroUsuario.toLowerCase());
      const matchFecha = !this.filtroFecha || 
        this.formatDate(cambio.fecha) === this.filtroFecha;

      return matchAccion && matchEntidad && matchUsuario && matchFecha;
    });

    this.currentPage = 1;
    this.actualizarPaginacion();
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getRolClass(rol: string): string {
    switch (rol) {
      case 'Admin': return 'bg-danger';
      case 'Abogado': return 'bg-info';
      case 'Usuario': return 'bg-success';
      default: return 'bg-secondary';
    }
  }

  getAccionClass(accion: string): string {
    switch (accion) {
      case 'Seguimiento': return 'bg-info';
      case 'Crear': return 'bg-success';
      case 'Editar': return 'bg-warning text-dark';
      case 'Eliminar': return 'bg-danger';
      case 'Login': return 'bg-info';
      case 'Logout': return 'bg-secondary';
      default: return 'bg-secondary';
    }
  }

  getAccionIcon(accion: string): string {
    switch (accion) {
      case 'Seguimiento': return 'bi bi-card-list';
      case 'Crear': return 'bi bi-plus-circle';
      case 'Editar': return 'bi bi-pencil';
      case 'Eliminar': return 'bi bi-trash';
      case 'Login': return 'bi bi-box-arrow-in-right';
      case 'Logout': return 'bi bi-box-arrow-left';
      default: return 'bi bi-circle';
    }
  }

  get cambiosPaginados(): Cambio[] {
    const inicio = (this.currentPage - 1) * this.itemsPerPage;
    const fin = inicio + this.itemsPerPage;
    return this.cambiosFiltrados.slice(inicio, fin);
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
    this.totalPages = Math.ceil(this.cambiosFiltrados.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = 1;
    }
  }
}
