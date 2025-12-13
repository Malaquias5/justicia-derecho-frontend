export interface Usuario {
  idUsuario: number;
  usuario: string;
  nombreCompleto: string;
  email: string;
  rol: 'Admin' | 'Abogado' | 'Usuario';
  activo: boolean;
  fechaCreacion: string | Date;
  ultimoAcceso?: string | Date;
}

export interface LoginRequest {
  usuario: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  usuario: string;
  nombreCompleto: string;
  email: string;
  rol: string;
  mensaje?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: LoginResponse;
  timestamp: string;
}

export interface UsuarioRequest {
  usuario: string;
  password: string;
  nombreCompleto: string;
  email: string;
  rol: string;
  activo?: boolean;
}
