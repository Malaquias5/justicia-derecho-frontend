import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse, AuthResponse, UsuarioRequest } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = environment.apiUrl;
  
  private currentUserSubject = new BehaviorSubject<LoginResponse | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    this.loadToken();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    // Modo simulado para desarrollo sin backend
    if (environment.mockMode) {
      return this.mockLogin(credentials);
    }
    
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success && response.data.token) {
            this.saveToken(response.data.token);
            this.currentUserSubject.next(response.data);
            this.isAuthenticatedSubject.next(true);
          }
        })
      );
  }

  private mockLogin(credentials: LoginRequest): Observable<AuthResponse> {
    // Usuarios de prueba
    const mockUsers: Record<string, { password: string; data: LoginResponse }> = {
      'admin': {
        password: 'admin123',
        data: {
          token: 'mock-token-admin',
          usuario: 'admin',
          nombreCompleto: 'Administrador Sistema',
          email: 'admin@bci.com',
          rol: 'Admin'
        }
      },
      'abogado1': {
        password: 'abogado123',
        data: {
          token: 'mock-token-abogado1',
          usuario: 'abogado1',
          nombreCompleto: 'Juan Pérez',
          email: 'juan.perez@bci.com',
          rol: 'Abogado'
        }
      },
      'abogado2': {
        password: 'abogado123',
        data: {
          token: 'mock-token-abogado2',
          usuario: 'abogado2',
          nombreCompleto: 'María González',
          email: 'maria.gonzalez@bci.com',
          rol: 'Abogado'
        }
      },
      'usuario1': {
        password: 'usuario123',
        data: {
          token: 'mock-token-usuario1',
          usuario: 'usuario1',
          nombreCompleto: 'Carlos Rodríguez',
          email: 'carlos.rodriguez@mail.com',
          rol: 'Usuario'
        }
      }
    };

    return new Observable(observer => {
      setTimeout(() => {
        const user = mockUsers[credentials.usuario];
        
        if (!user || user.password !== credentials.password) {
          observer.error({
            error: { message: 'Usuario o contraseña incorrectos' }
          });
        } else {
          const response: AuthResponse = {
            success: true,
            message: 'Login exitoso',
            data: user.data,
            timestamp: new Date().toISOString()
          };
          
          this.saveToken(user.data.token);
          this.currentUserSubject.next(user.data);
          this.isAuthenticatedSubject.next(true);
          
          observer.next(response);
          observer.complete();
        }
      }, 1000); // Simular latencia de red
    });
  }

  register(user: UsuarioRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, user);
  }

  logout(): void {
    const token = this.getToken();
    if (token) {
      this.http.post(`${this.apiUrl}/auth/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe();
    }
    this.clearAuth();
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): LoginResponse | null {
    return this.currentUserSubject.value;
  }

  getUserRole(): string | null {
    return this.currentUserSubject.value?.rol || null;
  }

  isAdmin(): boolean {
    return this.getUserRole() === environment.roles.admin;
  }

  isAbogado(): boolean {
    return this.getUserRole() === environment.roles.abogado;
  }

  isUsuario(): boolean {
    return this.getUserRole() === environment.roles.usuario;
  }

  private loadToken(): void {
    const token = this.getToken();
    if (token && this.isTokenValid(token)) {
      const decoded = this.decodeToken(token);
      this.currentUserSubject.next({
        token,
        usuario: decoded.sub,
        nombreCompleto: decoded.nombreCompleto || '',
        email: decoded.email || '',
        rol: decoded.role
      });
      this.isAuthenticatedSubject.next(true);
    }
  }

  private saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  private clearAuth(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  private isTokenValid(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      return Date.now() < decoded.exp * 1000;
    } catch {
      return false;
    }
  }

  private decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  }
}
