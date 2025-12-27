import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      usuario: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Si ya está autenticado, redirigir al dashboard
    if (this.authService.getToken()) {
      this.redirectToDashboard();
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.toastr.warning('Complete todos los campos correctamente', 'Validación');
      return;
    }

    this.isLoading = true;
    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.toastr.success('Inicio de sesión exitoso', 'Bienvenido');
        this.redirectToDashboard();
      },
      error: (error) => {
        this.isLoading = false;
        let errorMessage = 'Error al iniciar sesión';

        // Manejo específico de errores
        if (error.status === 401) {
          errorMessage = 'Usuario o contraseña incorrectos';
        } else if (error.status === 403) {
          errorMessage = 'Cuenta inactiva. Contacte al administrador';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }

        this.toastr.error(errorMessage, 'Error');
        console.error('Error de login:', error);
      },
    });
  }

  private redirectToDashboard(): void {
    const userRole = this.authService.getUserRole();
    
    switch (userRole) {
      case 'Admin':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'Abogado':
        this.router.navigate(['/abogado/dashboard']);
        break;
      default:
        // Si el rol no es válido, regresamos al login
        this.authService.logout();
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Getters para fácil acceso en el template
  get usuario() { return this.loginForm.get('usuario'); }
  get password() { return this.loginForm.get('password'); }
}
