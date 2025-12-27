import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocumentosService } from '../../../core/services/documentos.service';
import { CasosService } from '../../../core/services/casos.service';
import { ToastrService } from 'ngx-toastr';
import { Documento } from '../../../core/models/documento.model';
import { Caso } from '../../../core/models/caso.model';

@Component({
  selector: 'app-documentos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.scss'],
})
export class DocumentosComponent implements OnInit {
  mostrarModal = false;
  archivoSeleccionado: File | null = null;
  documentos: Documento[] = [];
  casos: Caso[] = [];
  cargando = false;

  nuevoDocumento = {
    titulo: '',
    tipo: '',
    casoId: 0,
    descripcion: '',
  };

  // Estadísticas
  totalDocumentos = 0;
  documentosHoy = 0;
  espacioUsado = 0;

  constructor(
    private documentosService: DocumentosService,
    private casosService: CasosService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.cargarDocumentos();
    this.cargarCasos();
  }

  cargarDocumentos(): void {
    this.cargando = true;
    this.documentosService.listarMisDocumentos().subscribe({
      next: (response) => {
        if (response.success) {
          this.documentos = response.data || [];
          this.calcularEstadisticas();
        }
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar documentos:', error);
        this.toastr.error('Error al cargar los documentos', 'Error');
        this.cargando = false;
      },
    });
  }

  cargarCasos(): void {
    this.casosService.listarCasosActivos().subscribe({
      next: (response) => {
        if (response.success) {
          this.casos = response.data || [];
        }
      },
      error: (error) => {
        console.error('Error al cargar casos:', error);
      },
    });
  }

  calcularEstadisticas(): void {
    this.totalDocumentos = this.documentos.length;

    // Documentos subidos hoy
    const hoy = new Date().toDateString();
    this.documentosHoy = this.documentos.filter((doc) => {
      const fechaDoc = new Date(doc.fechaCarga).toDateString();
      return fechaDoc === hoy;
    }).length;

    // Espacio usado en bytes
    this.espacioUsado = this.documentos.reduce((total, doc) => total + (doc.tamanoBytes || 0), 0);
  }

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
        this.toastr.warning('El archivo es muy grande. El tamaño máximo es 10MB.', 'Validación');
        return;
      }
      this.archivoSeleccionado = file;
    }
  }

  subirDocumento(): void {
    if (!this.nuevoDocumento.tipo || !this.archivoSeleccionado) {
      this.toastr.warning(
        'Por favor completa el tipo de documento y selecciona un archivo',
        'Validación'
      );
      return;
    }

    if (this.nuevoDocumento.casoId === 0 || !this.nuevoDocumento.casoId) {
      this.toastr.warning('Por favor selecciona un caso relacionado', 'Validación');
      return;
    }

    this.cargando = true;

    const documentoRequest = {
      idRegistro: this.nuevoDocumento.casoId,
      tipoDocumento: this.nuevoDocumento.tipo,
      archivo: this.archivoSeleccionado,
    };

    this.documentosService.subirDocumento(documentoRequest).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('Documento subido correctamente', 'Éxito');
          this.cerrarModal();
          this.cargarDocumentos();
        } else {
          this.toastr.error(response.message || 'Error al subir el documento', 'Error');
        }
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al subir documento:', error);
        this.toastr.error('Error al subir el documento', 'Error');
        this.cargando = false;
      },
    });
  }

  descargarDocumento(doc: Documento): void {
    this.documentosService.descargarDocumento(doc.idDocumento).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = doc.nombreArchivo;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.toastr.success('Documento descargado', 'Éxito');
      },
      error: (error) => {
        console.error('Error al descargar:', error);
        this.toastr.error('Error al descargar el documento', 'Error');
      },
    });
  }

  eliminarDocumento(doc: Documento): void {
    if (confirm(`¿Estás seguro de eliminar el documento "${doc.nombreArchivo}"?`)) {
      this.documentosService.eliminarDocumento(doc.idDocumento).subscribe({
        next: (response) => {
          this.toastr.success('Documento eliminado correctamente', 'Éxito');
          this.cargarDocumentos();
        },
        error: (error) => {
          console.error('Error al eliminar:', error);
          this.toastr.error('Error al eliminar el documento', 'Error');
        },
      });
    }
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatDate(date: string | Date): string {
    if (!date) return '-';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  resetearFormulario(): void {
    this.nuevoDocumento = {
      titulo: '',
      tipo: '',
      casoId: 0,
      descripcion: '',
    };
    this.archivoSeleccionado = null;
  }
}
