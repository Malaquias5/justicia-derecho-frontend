export interface Seguimiento {
  idSeguimiento: number;
  idRegistro: number;
  numeroCaso: string;
  numeroSeguimiento: number;
  fechaSeguimiento: string | Date;
  tipoMovimiento: string;
  descripcion: string;
  usuarioRegistro: string;
}

export interface SeguimientoRequest {
  idRegistro: number;
  tipoMovimiento: string;
  descripcion: string;
}
