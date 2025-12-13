import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;

  roles = [
    { label: 'Abogado', value: 'Abogado' },
    { label: 'Usuario', value: 'Usuario' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.registerForm = this.fb.group({
      usuario: ['', [Validators.required, Validators.minLength(3)]],
      nombreCompleto: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      rol: ['Usuario', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const userData = { ...this.registerForm.value };
    delete userData.confirmPassword;

    this.authService.register(userData).subscribe({
      next: (response) => {
        this.toastr.success('Registro exitoso', 'Bienvenido');
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        this.isLoading = false;
        const errorMessage = error.error?.message || 'Error en el registro';
        this.toastr.error(errorMessage, 'Error');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  // Getters para fácil acceso
  get usuario() { return this.registerForm.get('usuario'); }
  get nombreCompleto() { return this.registerForm.get('nombreCompleto'); }
  get email() { return this.registerForm.get('email'); }
  get rol() { return this.registerForm.get('rol'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
}
