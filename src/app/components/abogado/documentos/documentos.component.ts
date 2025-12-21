import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-documentos',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="documentos-container p-4">
      <!-- Header -->
      <div class="mb-4">
        <h2 class="h4 mb-2">
          <i class="bi bi-file-earmark-text me-2"></i>Gestión de Documentos
        </h2>
        <p class="text-muted mb-0">Administra todos los documentos de los casos judiciales</p>
      </div>

      <!-- Estadísticas -->
      <div class="row mb-4">
        <div class="col-md-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h3 class="display-6 fw-bold text-primary mb-1">0</h3>
                  <p class="text-muted mb-0 small">Total Documentos</p>
                </div>
                <i class="bi bi-files text-primary" style="font-size: 2.5rem; opacity: 0.2;"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h3 class="display-6 fw-bold text-success mb-1">0</h3>
                  <p class="text-muted mb-0 small">Subidos Hoy</p>
                </div>
                <i class="bi bi-upload text-success" style="font-size: 2.5rem; opacity: 0.2;"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h3 class="display-6 fw-bold text-info mb-1">0 MB</h3>
                  <p class="text-muted mb-0 small">Espacio Usado</p>
                </div>
                <i class="bi bi-hdd text-info" style="font-size: 2.5rem; opacity: 0.2;"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h3 class="display-6 fw-bold text-warning mb-1">0</h3>
                  <p class="text-muted mb-0 small">Pendientes</p>
                </div>
                <i class="bi bi-clock text-warning" style="font-size: 2.5rem; opacity: 0.2;"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenido principal -->
      <div class="card border-0 shadow-sm">
        <div class="card-header bg-white border-bottom">
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
              <i class="bi bi-folder2-open me-2"></i>Documentos Recientes
            </h5>
            <button class="btn btn-primary" (click)="abrirModalSubir()">
              <i class="bi bi-cloud-upload me-2"></i>Subir Documento
            </button>
          </div>
        </div>
        <div class="card-body">
          <!-- Estado: En desarrollo -->
          <div class="text-center py-5">
            <i class="bi bi-hammer" style="font-size: 4rem; color: #0d6efd; opacity: 0.3;"></i>
            <h4 class="mt-4 mb-2">Módulo en Desarrollo</h4>
            <p class="text-muted mb-4">
              La funcionalidad de gestión de documentos está siendo implementada.<br>
              Próximamente podrás subir, visualizar y organizar documentos relacionados con los casos.
            </p>
            
            <!-- Features planificados -->
            <div class="row mt-5 text-start">
              <div class="col-md-4">
                <div class="d-flex align-items-start mb-3">
                  <i class="bi bi-check-circle-fill text-success me-3" style="font-size: 1.5rem;"></i>
                  <div>
                    <h6 class="mb-1">Subida de Archivos</h6>
                    <small class="text-muted">PDF, Word, imágenes y más</small>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="d-flex align-items-start mb-3">
                  <i class="bi bi-check-circle-fill text-success me-3" style="font-size: 1.5rem;"></i>
                  <div>
                    <h6 class="mb-1">Organización por Caso</h6>
                    <small class="text-muted">Documentos asociados a cada caso</small>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="d-flex align-items-start mb-3">
                  <i class="bi bi-check-circle-fill text-success me-3" style="font-size: 1.5rem;"></i>
                  <div>
                    <h6 class="mb-1">Vista Previa</h6>
                    <small class="text-muted">Visualiza sin descargar</small>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="d-flex align-items-start mb-3">
                  <i class="bi bi-check-circle-fill text-success me-3" style="font-size: 1.5rem;"></i>
                  <div>
                    <h6 class="mb-1">Control de Versiones</h6>
                    <small class="text-muted">Historial de cambios</small>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="d-flex align-items-start mb-3">
                  <i class="bi bi-check-circle-fill text-success me-3" style="font-size: 1.5rem;"></i>
                  <div>
                    <h6 class="mb-1">Búsqueda Avanzada</h6>
                    <small class="text-muted">Encuentra documentos rápidamente</small>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="d-flex align-items-start mb-3">
                  <i class="bi bi-check-circle-fill text-success me-3" style="font-size: 1.5rem;"></i>
                  <div>
                    <h6 class="mb-1">Compartir</h6>
                    <small class="text-muted">Envía enlaces seguros</small>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-4">
              <button class="btn btn-outline-primary me-2" routerLink="/abogado/dashboard">
                <i class="bi bi-house me-2"></i>Volver al Dashboard
              </button>
              <button class="btn btn-outline-secondary" routerLink="/abogado/casos">
                <i class="bi bi-folder me-2"></i>Ver Casos
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Subir Documento -->
      <div class="modal fade" [class.show]="mostrarModal" [style.display]="mostrarModal ? 'block' : 'none'" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                <i class="bi bi-cloud-upload me-2"></i>Subir Documento
              </h5>
              <button type="button" class="btn-close" (click)="cerrarModal()"></button>
            </div>
            <div class="modal-body">
              <form>
                <div class="mb-3">
                  <label class="form-label">Título del Documento</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    [(ngModel)]="nuevoDocumento.titulo"
                    name="titulo"
                    placeholder="Ej: Acta de Audiencia">
                </div>

                <div class="mb-3">
                  <label class="form-label">Tipo de Documento</label>
                  <select class="form-select" [(ngModel)]="nuevoDocumento.tipo" name="tipo">
                    <option value="">Selecciona un tipo</option>
                    <option value="Escrito">Escrito</option>
                    <option value="Acta">Acta</option>
                    <option value="Sentencia">Sentencia</option>
                    <option value="Resolución">Resolución</option>
                    <option value="Prueba">Prueba</option>
                    <option value="Notificación">Notificación</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div class="mb-3">
                  <label class="form-label">Caso Relacionado (Opcional)</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    [(ngModel)]="nuevoDocumento.caso"
                    name="caso"
                    placeholder="Número de caso">
                </div>

                <div class="mb-3">
                  <label class="form-label">Archivo</label>
                  <input 
                    type="file" 
                    class="form-control" 
                    (change)="onFileSelected($event)"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png">
                  <small class="text-muted">Formatos: PDF, Word, Imágenes (Max 10MB)</small>
                </div>

                <div class="mb-3" *ngIf="archivoSeleccionado">
                  <div class="alert alert-info mb-0">
                    <i class="bi bi-file-earmark-check me-2"></i>
                    <strong>{{ archivoSeleccionado.name }}</strong> 
                    ({{ (archivoSeleccionado.size / 1024 / 1024).toFixed(2) }} MB)
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Descripción</label>
                  <textarea 
                    class="form-control" 
                    rows="3"
                    [(ngModel)]="nuevoDocumento.descripcion"
                    name="descripcion"
                    placeholder="Descripción breve del documento"></textarea>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="cerrarModal()">
                <i class="bi bi-x-circle me-2"></i>Cancelar
              </button>
              <button 
                type="button" 
                class="btn btn-primary" 
                (click)="subirDocumento()"
                [disabled]="!nuevoDocumento.titulo || !archivoSeleccionado">
                <i class="bi bi-upload me-2"></i>Subir Documento
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-backdrop fade" [class.show]="mostrarModal" *ngIf="mostrarModal"></div>
    </div>
  `,
  styles: [`
    .documentos-container {
      animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .card {
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
    }

    .modal.show {
      display: block !important;
    }

    .modal-backdrop.show {
      opacity: 0.5;
    }
  `]
})
export class DocumentosComponent implements OnInit {
  mostrarModal = false;
  archivoSeleccionado: File | null = null;
  
  nuevoDocumento = {
    titulo: '',
    tipo: '',
    caso: '',
    descripcion: ''
  };

  ngOnInit(): void {}

  abrirModalSubir(): void {
    this.mostrarModal = true;
    document.body.classList.add('modal-open');
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    document.body.classList.remove('modal-open');
    this.resetearFormulario();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validar tamaño (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('El archivo es muy grande. El tamaño máximo es 10MB.');
        return;
      }
      this.archivoSeleccionado = file;
    }
  }

  subirDocumento(): void {
    if (!this.nuevoDocumento.titulo || !this.archivoSeleccionado) {
      alert('Por favor completa todos los campos obligatorios.');
      return;
    }

    // Aquí iría la lógica para subir el documento al backend
    console.log('Subiendo documento:', this.nuevoDocumento);
    console.log('Archivo:', this.archivoSeleccionado);

    alert(`Documento "${this.nuevoDocumento.titulo}" simulado exitosamente.\n\nNota: Esta es una demostración. En producción, el archivo se subiría al servidor.`);
    
    this.cerrarModal();
  }

  resetearFormulario(): void {
    this.nuevoDocumento = {
      titulo: '',
      tipo: '',
      caso: '',
      descripcion: ''
    };
    this.archivoSeleccionado = null;
  }
}
