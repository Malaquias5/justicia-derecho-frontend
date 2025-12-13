export interface Caso {
  idRegistro: number;
  abogado: string;
  patrocinado: string;
  numeroCaso: string;
  fechaIngreso: string | Date;
  fechaVencimiento: string | Date;
  tipoCaso: string;
  dependencia: 'COMISARIA' | 'FISCALIA';
  opcionLlenado?: string;
  estado: 'Pendiente' | 'En Proceso' | 'Finalizado';
  usuarioRegistro: string;
  fechaRegistro: string | Date;
  fechaActualizacion?: string | Date;
  diasRestantes?: number;
  nivelUrgencia?: 'Vencido' | 'Urgente' | 'Próximo' | 'Normal';
}

export interface CasoRequest {
  abogado: string;
  patrocinado: string;
  numeroCaso: string;
  fechaIngreso: string | Date;
  fechaVencimiento: string | Date;
  tipoCaso: string;
  dependencia: string;
  opcionLlenado?: string;
  estado?: string;
}

export interface BusquedaCasos {
  numeroCaso?: string;
  abogado?: string;
  estado?: string;
  dependencia?: string;
  fechaDesde?: Date | null;
  fechaHasta?: Date | null;
}
