import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CasosService } from '../../../../core/services/casos.service';
import { SeguimientosService } from '../../../../core/services/seguimientos.service';
import { DocumentosService } from '../../../../core/services/documentos.service';

@Component({
  selector: 'app-caso-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './caso-detail.component.html',
  styleUrls: ['./caso-detail.component.scss'],
})
export class CasoDetailComponent implements OnInit {
  public id!: number;
  public caso: any = null;
  public seguimientos: any[] = [];
  public documentos: any[] = [];

  // Modales
  public showModalSeguimiento = false;
  public showModalDocumento = false;

  // Formularios
  public seguimientoForm: FormGroup;
  public documentoForm: FormGroup;
  public archivoSeleccionado: File | null = null;

  public Math = Math;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private casosService: CasosService,
    private seguimientosService: SeguimientosService,
    private documentosService: DocumentosService,
    private toastr: ToastrService
  ) {
    this.seguimientoForm = this.fb.group({
      tipoMovimiento: ['', Validators.required],
      descripcion: [''],
    });
    this.documentoForm = this.fb.group({
      tipoDocumento: ['', Validators.required],
      descripcion: [''],
      archivo: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');

      if (!idParam) {
        this.toastr.error('Identificador de caso no válido', 'Error');
        this.router.navigate(['/abogado/casos']);
        return;
      }

      this.id = Number(idParam);
      this.cargarCaso();
      this.cargarSeguimientos();
      this.cargarDocumentos();
    });
  }

  cargarCaso(): void {
    this.casosService.obtenerCaso(this.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.caso = response.data;
        } else {
          this.toastr.error('Caso no encontrado', 'Error');
          this.router.navigate(['/abogado/casos']);
        }
      },
      error: (error) => {
        console.error('Error al cargar caso:', error);
        this.toastr.error('Error al cargar el caso', 'Error');
        this.router.navigate(['/abogado/casos']);
      },
    });
  }

  cargarSeguimientos(): void {
    this.seguimientosService.listarSeguimientosPorCaso(this.id).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.seguimientos = response.data || [];
        }
      },
      error: (error) => {
        console.error('Error al cargar seguimientos:', error);
      },
    });
  }

  cargarDocumentos(): void {
    this.documentosService.listarDocumentosPorCaso(this.id).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.documentos = response.data || [];
        }
      },
      error: (error) => {
        console.error('Error al cargar documentos:', error);
      },
    });
  }

  cambiarEstado(): void {
    if (!this.caso) {
      this.toastr.error('No se ha cargado el caso', 'Error');
      return;
    }

    const estadoActual = this.caso.estado;
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
      // Enviar solo los campos necesarios que espera el backend
      const casoActualizado = {
        abogado: this.caso.abogado,
        patrocinado: this.caso.patrocinado,
        numeroCaso: this.caso.numeroCaso,
        fechaIngreso: this.caso.fechaIngreso,
        fechaVencimiento: this.caso.fechaVencimiento,
        tipoCaso: this.caso.tipoCaso,
        dependencia: this.caso.dependencia,
        opcionLlenado: this.caso.opcionLlenado || '',
        descripcion: this.caso.descripcion || '',
        estado: nuevoEstado,
      };

      this.casosService.actualizarCaso(this.id, casoActualizado).subscribe({
        next: (response) => {
          if (response.success) {
            // Crear seguimiento automático del cambio de estado
            const seguimientoCambioEstado = {
              idRegistro: this.id,
              tipoMovimiento: 'Cambio de Estado',
              descripcion: `Estado cambiado de "${estadoActual}" a "${nuevoEstado}"`,
            };

            this.seguimientosService.crearSeguimiento(seguimientoCambioEstado).subscribe({
              next: () => {
                this.toastr.success('Estado actualizado correctamente', 'Éxito');
                this.cargarCaso();
                this.cargarSeguimientos();
              },
              error: (error) => {
                console.error('Error al crear seguimiento:', error);
                this.toastr.success('Estado actualizado (sin registro en historial)', 'Éxito');
                this.cargarCaso();
                this.cargarSeguimientos();
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

  mostrarModalSeguimiento(): void {
    this.showModalSeguimiento = true;
    this.seguimientoForm.reset();
    document.body.classList.add('modal-open');
  }

  cerrarModalSeguimiento(): void {
    this.showModalSeguimiento = false;
    document.body.classList.remove('modal-open');
  }

  guardarSeguimiento(): void {
    if (this.seguimientoForm.invalid) {
      this.toastr.warning('Complete todos los campos requeridos', 'Validación');
      return;
    }

    const seguimiento = {
      idRegistro: this.id,
      tipoMovimiento: this.seguimientoForm.value.tipoMovimiento,
      descripcion: this.seguimientoForm.value.descripcion || '',
    };

    this.seguimientosService.crearSeguimiento(seguimiento).subscribe({
      next: (response) => {
        this.toastr.success('Seguimiento agregado correctamente', 'Éxito');
        this.cerrarModalSeguimiento();
        this.cargarSeguimientos();
      },
      error: (error) => {
        console.error('Error al guardar seguimiento:', error);
        this.toastr.error('Error al guardar el seguimiento', 'Error');
      },
    });
  }

  mostrarModalDocumento(): void {
    this.showModalDocumento = true;
    this.documentoForm.reset();
    this.archivoSeleccionado = null;
    document.body.classList.add('modal-open');
  }

  cerrarModalDocumento(): void {
    this.showModalDocumento = false;
    this.documentoForm.reset();
    this.archivoSeleccionado = null;
    document.body.classList.remove('modal-open');
  }

  onArchivoSeleccionado(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validar tamaño (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        this.toastr.error('El archivo no debe superar 10MB', 'Error');
        event.target.value = '';
        return;
      }

      // Validar tipo de archivo
      const tiposPermitidos = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
      ];

      if (!tiposPermitidos.includes(file.type)) {
        this.toastr.error('Solo se permiten archivos PDF, Word o imágenes', 'Error');
        event.target.value = '';
        return;
      }

      this.archivoSeleccionado = file;
      this.documentoForm.patchValue({ archivo: file });
    }
  }

  guardarDocumento(): void {
    if (this.documentoForm.invalid || !this.archivoSeleccionado) {
      this.toastr.warning('Complete todos los campos y seleccione un archivo', 'Validación');
      return;
    }

    const formData = new FormData();
    formData.append('idRegistro', this.id.toString());
    formData.append('tipoDocumento', this.documentoForm.value.tipoDocumento);
    formData.append('descripcion', this.documentoForm.value.descripcion || '');
    formData.append('archivo', this.archivoSeleccionado);

    this.documentosService.subirDocumento(formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('Documento subido correctamente', 'Éxito');
          this.cerrarModalDocumento();
          this.cargarDocumentos();
        } else {
          this.toastr.error('Error al subir el documento', 'Error');
        }
      },
      error: (error) => {
        console.error('Error al guardar documento:', error);
        this.toastr.error('Error al subir el documento', 'Error');
      },
    });
  }

  formatDate(date: string | Date, includeTime: boolean = false): string {
    if (!date) return '-';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    if (includeTime) {
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    }

    return `${day}/${month}/${year}`;
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

