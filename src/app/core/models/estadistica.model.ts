export interface EstadisticaAbogado {
  abogado: string;
  totalCasos: number;
  casosPendientes: number;
  casosEnProceso: number;
  casosFinalizados: number;
  casosVencidos: number;
}

export interface ActividadUsuario {
  usuario: string;
  totalCambios: number;
}

export interface EstadisticasResponse {
  totalUsuarios: number;
  totalAdmin: number;
  totalAbogados: number;
  totalUsuariosNormales: number;
  totalCasos: number;
  casosActivos: number;
  casosVencidos: number;
  casosUrgentes: number;
  estadisticasAbogados: EstadisticaAbogado[];
  actividadUsuarios: ActividadUsuario[];
}
