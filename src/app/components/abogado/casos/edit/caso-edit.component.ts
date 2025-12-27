import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CasosService } from '../../../../core/services/casos.service';

@Component({
  selector: 'app-caso-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './caso-edit.component.html',
  styleUrls: ['./caso-edit.component.scss']
})
export class CasoEditComponent implements OnInit {
  id!: number;
  caso: any = null;
  casoForm: FormGroup;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private casosService: CasosService,
    private toastr: ToastrService
  ) {
    // Solo hacemos editables patrocinado y opcionLlenado
    this.casoForm = this.fb.group({
      patrocinado: ['', Validators.required],
      opcionLlenado: ['']
    });
  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarCaso();
  }

  cargarCaso(): void {
    this.casosService.obtenerCaso(this.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.caso = response.data;
          this.cargarFormulario();
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

  cargarFormulario(): void {
    // Solo cargamos los campos editables
    this.casoForm.patchValue({
      patrocinado: this.caso.patrocinado || '',
      opcionLlenado: this.caso.opcionLlenado || ''
    });
  }

  onSubmit(): void {
    if (this.casoForm.invalid) {
      this.casoForm.markAllAsTouched();
      this.toastr.warning('Complete todos los campos requeridos', 'Validación');
      return;
    }

    if (!this.casoForm.dirty) {
      this.toastr.info('No hay cambios para guardar', 'Información');
      return;
    }

    this.isLoading = true;

    // Construir el objeto completo con TODOS los campos requeridos
    const casoActualizado = {
      abogado: this.caso.abogado,
      patrocinado: this.casoForm.value.patrocinado,
      numeroCaso: this.caso.numeroCaso,
      fechaIngreso: this.caso.fechaIngreso,
      fechaVencimiento: this.caso.fechaVencimiento,
      tipoCaso: this.caso.tipoCaso,
      dependencia: this.caso.dependencia,
      opcionLlenado: this.casoForm.value.opcionLlenado || '',
      descripcion: this.caso.descripcion || '',
      estado: this.caso.estado,
    };

    this.casosService.actualizarCaso(this.id, casoActualizado).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.toastr.success('Caso actualizado exitosamente', 'Éxito');
          this.router.navigate(['/abogado/casos', this.id]);
        } else {
          this.toastr.error('Error al actualizar caso', 'Error');
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al actualizar:', error);
        const errorMessage = error.error?.message || 'Error al actualizar caso';
        this.toastr.error(errorMessage, 'Error');
      },
    });
  }

  cancelar(): void {
    if (this.casoForm.dirty) {
      if (confirm('¿Desea descartar los cambios?')) {
        this.router.navigate(['/abogado/casos', this.id]);
      }
    } else {
      this.router.navigate(['/abogado/casos', this.id]);
    }
  }

  formatDateDisplay(date: string | Date, includeTime: boolean = false): string {
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
}
