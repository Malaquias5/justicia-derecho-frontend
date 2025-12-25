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
  styleUrls: ['./caso-detail.component.scss']
})
export class CasoDetailComponent implements OnInit {
  id!: number;
  caso: any = null;
  seguimientos: any[] = [];
  documentos: any[] = [];
  showModalSeguimiento = false;
  seguimientoForm: FormGroup;
  Math = Math;

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
      descripcion: ['']
    });
  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarCaso();
    this.cargarSeguimientos();
    this.cargarDocumentos();
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
      }
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
      }
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
      }
    });
  }

  cambiarEstado(): void {
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
      const casoActualizado = { ...this.caso, estado: nuevoEstado };
      
      this.casosService.actualizarCaso(this.id, casoActualizado).subscribe({
        next: (response) => {
          this.toastr.success('Estado actualizado correctamente', 'Éxito');
          this.cargarCaso();
        },
        error: (error) => {
          console.error('Error al actualizar estado:', error);
          this.toastr.error('Error al actualizar el estado', 'Error');
        }
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
      idCaso: this.id,
      ...this.seguimientoForm.value
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
      }
    });
  }

  mostrarModalDocumento(): void {
    this.toastr.info('Funcionalidad en desarrollo', 'Información');
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
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
