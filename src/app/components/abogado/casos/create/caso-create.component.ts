import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CasosService } from '../../../../core/services/casos.service';
import { AuthService } from '../../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-caso-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './caso-create.component.html',
  styleUrls: ['./caso-create.component.scss'],
})
export class CasoCreateComponent implements OnInit {
  casoForm: FormGroup;
  isLoading = false;
  today = new Date();

  tiposCaso = environment.tiposCaso;
  dependencias = environment.dependencias;
  estados = environment.estadosCaso;

  constructor(
    private readonly fb: FormBuilder,
    private readonly casosService: CasosService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly toastr: ToastrService
  ) {
    this.casoForm = this.fb.group({
      numeroCaso: ['', Validators.required],
      abogado: ['', Validators.required],
      patrocinado: ['', Validators.required],
      fechaIngreso: [null, Validators.required],
      fechaVencimiento: [null, Validators.required],
      tipoCaso: ['', Validators.required],
      dependencia: ['', Validators.required],
      opcionLlenado: [''],
      estado: ['Pendiente', Validators.required],
    });
  }

  ngOnInit(): void {
    // Establecer abogado como el usuario actual
    const user = this.authService.getUser();
    if (user) {
      this.casoForm.patchValue({
        abogado: user.nombreCompleto,
      });
    }
  }

  onSubmit(): void {
    if (this.casoForm.invalid) {
      this.casoForm.markAllAsTouched();
      this.toastr.warning('Complete todos los campos requeridos', 'Validación');
      return;
    }

    this.isLoading = true;
    const casoData = { ...this.casoForm.value };

    // Formatear fechas si es necesario
    if (casoData.fechaIngreso) {
      casoData.fechaIngreso = this.formatDate(casoData.fechaIngreso);
    }
    if (casoData.fechaVencimiento) {
      casoData.fechaVencimiento = this.formatDate(casoData.fechaVencimiento);
    }

    console.log('Enviando caso:', casoData); // Para debug

    this.casosService.crearCaso(casoData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.toastr.success('Caso creado exitosamente', 'Éxito');
        this.router.navigate(['/abogado/casos']);
      },
      error: (error) => {
        this.isLoading = false;
        const errorMessage = error.error?.message || 'Error al crear caso';
        this.toastr.error(errorMessage, 'Error');
        console.error('Error al crear caso:', error);
      },
    });
  }

  private formatDate(date: any): string {
    // Si ya es un string en formato correcto, devolverlo tal cual
    if (typeof date === 'string') {
      return date;
    }
    // Si es un objeto Date, formatearlo
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }
    return date;
  }

  // Getters
  get numeroCaso() {
    return this.casoForm.get('numeroCaso');
  }
}
