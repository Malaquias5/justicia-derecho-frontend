import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Seguimiento {
  id: number;
  idCaso: number;
  numeroCaso: string;
  fecha: Date;
  usuario: string;
  tipo: string;
  descripcion: string;
  documentos?: number;
}

@Component({
  selector: 'app-seguimientos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="seguimientos-container p-4">
      <!-- Header -->
      <div class="mb-4">
        <h2 class="h4 mb-2">
          <i class="bi bi-card-list me-2 text-primary"></i>Seguimientos de Casos
        </h2>
        <p class="text-muted mb-0">Registro y consulta de todos los seguimientos realizados</p>
      </div>

      <!-- Acciones rápidas -->
      <div class="row mb-4">
        <div class="col-md-4">
          <div class="card border-0 shadow-sm bg-primary text-white h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h3 class="display-6 fw-bold mb-1">{{ totalSeguimientos }}</h3>
                  <p class="mb-0">Seguimientos Totales</p>
                </div>
                <i class="bi bi-journal-text" style="font-size: 3rem; opacity: 0.3;"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card border-0 shadow-sm bg-success text-white h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h3 class="display-6 fw-bold mb-1">{{ seguimientosHoy }}</h3>
                  <p class="mb-0">Registrados Hoy</p>
                </div>
                <i class="bi bi-calendar-check" style="font-size: 3rem; opacity: 0.3;"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card border-0 shadow-sm bg-info text-white h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h3 class="display-6 fw-bold mb-1">{{ casosConSeguimiento }}</h3>
                  <p class="mb-0">Casos Activos</p>
                </div>
                <i class="bi bi-folder-check" style="font-size: 3rem; opacity: 0.3;"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Formulario nuevo seguimiento -->
      <div class="card border-0 shadow-sm mb-4" *ngIf="mostrarFormulario">
        <div class="card-header bg-primary text-white">
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
              <i class="bi bi-plus-circle me-2"></i>Nuevo Seguimiento
            </h5>
            <button type="button" class="btn-close btn-close-white" (click)="cancelarFormulario()"></button>
          </div>
        </div>
        <div class="card-body">
          <form>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Número de Caso <span class="text-danger">*</span></label>
                <input 
                  type="text" 
                  class="form-control" 
                  [(ngModel)]="nuevoSeguimiento.numeroCaso"
                  name="numeroCaso"
                  placeholder="Ej: CASO-2024-001">
              </div>
              <div class="col-md-6">
                <label class="form-label">Tipo de Seguimiento <span class="text-danger">*</span></label>
                <select class="form-select" [(ngModel)]="nuevoSeguimiento.tipo" name="tipo">
                  <option value="">Seleccionar...</option>
                  <option value="Audiencia">Audiencia</option>
                  <option value="Presentación">Presentación de Documento</option>
                  <option value="Resolución">Resolución</option>
                  <option value="Notificación">Notificación</option>
                  <option value="Diligencia">Diligencia</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div class="col-12">
                <label class="form-label">Descripción <span class="text-danger">*</span></label>
                <textarea 
                  class="form-control" 
                  rows="4"
                  [(ngModel)]="nuevoSeguimiento.descripcion"
                  name="descripcion"
                  placeholder="Describa el seguimiento realizado..."></textarea>
              </div>
              <div class="col-md-6">
                <label class="form-label">Fecha</label>
                <input 
                  type="date" 
                  class="form-control" 
                  [(ngModel)]="nuevoSeguimiento.fecha"
                  name="fecha">
              </div>
              <div class="col-md-6">
                <label class="form-label">Documentos Adjuntos</label>
                <input type="file" class="form-control" multiple accept=".pdf,.doc,.docx,.jpg,.png">
                <small class="text-muted">PDF, Word, Imágenes</small>
              </div>
            </div>
            <div class="mt-3 d-flex gap-2">
              <button type="button" class="btn btn-primary" (click)="guardarSeguimiento()">
                <i class="bi bi-save me-2"></i>Guardar Seguimiento
              </button>
              <button type="button" class="btn btn-secondary" (click)="cancelarFormulario()">
                <i class="bi bi-x-circle me-2"></i>Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Botón para mostrar formulario -->
      <div class="mb-4" *ngIf="!mostrarFormulario">
        <button type="button" class="btn btn-primary" (click)="mostrarFormulario = true">
          <i class="bi bi-plus-circle me-2"></i>Nuevo Seguimiento
        </button>
      </div>

      <!-- Filtros -->
      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label small">Buscar por Caso</label>
              <input 
                type="text" 
                class="form-control" 
                [(ngModel)]="filtroCaso"
                (input)="aplicarFiltros()"
                placeholder="Número de caso...">
            </div>
            <div class="col-md-4">
              <label class="form-label small">Tipo</label>
              <select class="form-select" [(ngModel)]="filtroTipo" (change)="aplicarFiltros()">
                <option value="">Todos</option>
                <option value="Audiencia">Audiencia</option>
                <option value="Presentación">Presentación</option>
                <option value="Resolución">Resolución</option>
                <option value="Notificación">Notificación</option>
                <option value="Diligencia">Diligencia</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div class="col-md-4">
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

      <!-- Lista de seguimientos -->
      <div class="card border-0 shadow-sm">
        <div class="card-header bg-white border-bottom">
          <h5 class="mb-0">
            <i class="bi bi-list-ul me-2"></i>Historial de Seguimientos
          </h5>
        </div>
        <div class="card-body p-0">
          <div class="timeline-container p-4">
            <div class="timeline-item" *ngFor="let seguimiento of seguimientosPaginados">
              <div class="timeline-marker" [ngClass]="getTipoClass(seguimiento.tipo)"></div>
              <div class="timeline-content">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h6 class="mb-1">
                      <span class="badge" [ngClass]="getTipoClass(seguimiento.tipo)">
                        {{ seguimiento.tipo }}
                      </span>
                      <a [routerLink]="['/abogado/casos', seguimiento.idCaso]" class="ms-2 text-decoration-none">
                        {{ seguimiento.numeroCaso }}
                      </a>
                    </h6>
                    <small class="text-muted">
                      <i class="bi bi-person me-1"></i>{{ seguimiento.usuario }}
                      <i class="bi bi-calendar ms-3 me-1"></i>{{ seguimiento.fecha | date:'dd/MM/yyyy HH:mm' }}
                    </small>
                  </div>
                  <div class="btn-group btn-group-sm">
                    <button type="button" class="btn btn-outline-primary" title="Ver detalles">
                      <i class="bi bi-eye"></i>
                    </button>
                    <button type="button" class="btn btn-outline-warning" title="Editar">
                      <i class="bi bi-pencil"></i>
                    </button>
                  </div>
                </div>
                <p class="mb-2">{{ seguimiento.descripcion }}</p>
                <div *ngIf="seguimiento.documentos">
                  <small class="text-info">
                    <i class="bi bi-paperclip me-1"></i>
                    {{ seguimiento.documentos }} documento(s) adjunto(s)
                  </small>
                </div>
              </div>
            </div>

            <div class="text-center py-4" *ngIf="seguimientosFiltrados.length === 0">
              <i class="bi bi-inbox" style="font-size: 3rem; color: #6c757d; opacity: 0.3;"></i>
              <h6 class="mt-3 text-muted">No hay seguimientos registrados</h6>
            </div>
          </div>
        </div>
        <div class="card-footer bg-white border-top" *ngIf="seguimientosFiltrados.length > 0">
          <div class="d-flex justify-content-between align-items-center">
            <div class="text-muted small">
              Mostrando {{ (currentPage - 1) * itemsPerPage + 1 }} - 
              {{ Math.min(currentPage * itemsPerPage, seguimientosFiltrados.length) }} de {{ seguimientosFiltrados.length }} registros
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
    .seguimientos-container {
      animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .timeline-container {
      position: relative;
      padding-left: 40px;
    }

    .timeline-item {
      position: relative;
      padding-bottom: 30px;
    }

    .timeline-item:last-child {
      padding-bottom: 0;
    }

    .timeline-item::before {
      content: '';
      position: absolute;
      left: -34px;
      top: 24px;
      width: 2px;
      height: calc(100% + 6px);
      background: #dee2e6;
    }

    .timeline-item:last-child::before {
      display: none;
    }

    .timeline-marker {
      position: absolute;
      left: -40px;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 3px solid #fff;
      box-shadow: 0 0 0 2px #dee2e6;
      top: 8px;
    }

    .timeline-content {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      border-left: 3px solid #0d6efd;
      transition: all 0.2s;
    }

    .timeline-content:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      transform: translateX(2px);
    }
  `]
})
export class SeguimientosComponent implements OnInit {
  seguimientos: Seguimiento[] = [];
  seguimientosFiltrados: Seguimiento[] = [];

  // Estadísticas
  totalSeguimientos = 0;
  seguimientosHoy = 0;
  casosConSeguimiento = 0;

  // Filtros
  filtroCaso = '';
  filtroTipo = '';
  filtroFecha = '';

  // Formulario
  mostrarFormulario = false;
  nuevoSeguimiento: any = {
    numeroCaso: '',
    tipo: '',
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0]
  };

  // Paginación
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;
  Math = Math;

  ngOnInit(): void {
    this.cargarDatosEjemplo();
    this.calcularEstadisticas();
  }

  cargarDatosEjemplo(): void {
    const tipos = ['Audiencia', 'Presentación', 'Resolución', 'Notificación', 'Diligencia'];
    const usuarios = ['Dr. Juan Pérez', 'Dra. María García', 'Dr. Carlos López'];

    this.seguimientos = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      idCaso: Math.floor(Math.random() * 10) + 1,
      numeroCaso: `CASO-2024-${String(Math.floor(Math.random() * 100) + 1).padStart(3, '0')}`,
      fecha: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      usuario: usuarios[Math.floor(Math.random() * usuarios.length)],
      tipo: tipos[Math.floor(Math.random() * tipos.length)],
      descripcion: 'Se realizó seguimiento al caso. ' + (i % 2 === 0 ? 'Pendiente resolución del juzgado.' : 'Documentación presentada correctamente.'),
      documentos: Math.random() > 0.5 ? Math.floor(Math.random() * 5) + 1 : 0
    }));

    this.seguimientos.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
    this.seguimientosFiltrados = [...this.seguimientos];
    this.actualizarPaginacion();
  }

  calcularEstadisticas(): void {
    this.totalSeguimientos = this.seguimientos.length;
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    this.seguimientosHoy = this.seguimientos.filter(s => {
      const fecha = new Date(s.fecha);
      fecha.setHours(0, 0, 0, 0);
      return fecha.getTime() === hoy.getTime();
    }).length;

    this.casosConSeguimiento = new Set(this.seguimientos.map(s => s.idCaso)).size;
  }

  aplicarFiltros(): void {
    this.seguimientosFiltrados = this.seguimientos.filter(seg => {
      const matchCaso = !this.filtroCaso || 
        seg.numeroCaso.toLowerCase().includes(this.filtroCaso.toLowerCase());
      const matchTipo = !this.filtroTipo || seg.tipo === this.filtroTipo;
      const matchFecha = !this.filtroFecha || 
        this.formatDate(seg.fecha) === this.filtroFecha;

      return matchCaso && matchTipo && matchFecha;
    });

    this.currentPage = 1;
    this.actualizarPaginacion();
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  getTipoClass(tipo: string): string {
    switch (tipo) {
      case 'Audiencia': return 'bg-primary';
      case 'Presentación': return 'bg-info';
      case 'Resolución': return 'bg-success';
      case 'Notificación': return 'bg-warning';
      case 'Diligencia': return 'bg-secondary';
      default: return 'bg-dark';
    }
  }

  guardarSeguimiento(): void {
    if (!this.nuevoSeguimiento.numeroCaso || !this.nuevoSeguimiento.tipo || !this.nuevoSeguimiento.descripcion) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    alert('Seguimiento guardado exitosamente\n\nEsta es una demostración. En producción se guardaría en la base de datos.');
    this.cancelarFormulario();
  }

  cancelarFormulario(): void {
    this.mostrarFormulario = false;
    this.nuevoSeguimiento = {
      numeroCaso: '',
      tipo: '',
      descripcion: '',
      fecha: new Date().toISOString().split('T')[0]
    };
  }

  get seguimientosPaginados(): Seguimiento[] {
    const inicio = (this.currentPage - 1) * this.itemsPerPage;
    const fin = inicio + this.itemsPerPage;
    return this.seguimientosFiltrados.slice(inicio, fin);
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
    this.totalPages = Math.ceil(this.seguimientosFiltrados.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = 1;
    }
  }
}
