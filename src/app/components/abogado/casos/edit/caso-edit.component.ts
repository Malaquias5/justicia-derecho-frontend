import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CasosService } from '../../../../core/services/casos.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-caso-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink],
  templateUrl: './caso-edit.component.html',
  styleUrls: ['./caso-edit.component.scss']
})
export class CasoEditComponent implements OnInit {
  id!: number;
  caso: any = null;
  casoForm: FormGroup;
  isLoading = false;
  today = new Date();
  
  tiposCaso = environment.tiposCaso;
  dependencias = environment.dependencias;
  estados = environment.estadosCaso;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private casosService: CasosService,
    private toastr: ToastrService
  ) {
    this.casoForm = this.fb.group({
      abogado: ['', Validators.required],
      patrocinado: ['', Validators.required],
      fechaIngreso: [null],
      fechaVencimiento: [null, Validators.required],
      tipoCaso: ['', Validators.required],
      dependencia: ['', Validators.required],
      opcionLlenado: [''],
      estado: ['', Validators.required]
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
          this.router.navigate(['/abogado/casos']);
        }
      },
      error: () => {
        this.toastr.error('Error al cargar caso', 'Error');
        this.router.navigate(['/abogado/casos']);
      }
    });
  }

  cargarFormulario(): void {
    this.casoForm.patchValue({
      abogado: this.caso.abogado,
      patrocinado: this.caso.patrocinado,
      fechaIngreso: new Date(this.caso.fechaIngreso),
      fechaVencimiento: new Date(this.caso.fechaVencimiento),
      tipoCaso: this.caso.tipoCaso,
      dependencia: this.caso.dependencia,
      opcionLlenado: this.caso.opcionLlenado,
      estado: this.caso.estado
    });
  }

  onSubmit(): void {
    if (this.casoForm.invalid) {
      this.casoForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const casoData = this.casoForm.value;

    // Formatear fechas
    casoData.fechaIngreso = this.formatDate(casoData.fechaIngreso);
    casoData.fechaVencimiento = this.formatDate(casoData.fechaVencimiento);

    this.casosService.actualizarCaso(this.id, casoData).subscribe({
      next: (response) => {
        this.toastr.success('Caso actualizado exitosamente', 'Éxito');
        this.router.navigate(['/abogado/casos', this.id]);
      },
      error: (error) => {
        this.isLoading = false;
        const errorMessage = error.error?.message || 'Error al actualizar caso';
        this.toastr.error(errorMessage, 'Error');
      },
      complete: () => {
        this.isLoading = false;
      }
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

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  getUrgenciaSeverity(urgencia: string): 'danger' | 'warn' | 'info' | 'success' {
    switch (urgencia) {
      case 'Vencido': return 'danger';
      case 'Urgente': return 'warn';
      case 'Próximo': return 'warn';
      case 'Normal': return 'success';
      default: return 'info';
    }
  }

  // Getters
  get fechaVencimiento() { return this.casoForm.get('fechaVencimiento'); }
}
