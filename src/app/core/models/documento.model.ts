export interface Documento {
  idDocumento: number;
  idRegistro: number;
  nombreArchivo: string;
  rutaArchivo: string;
  tipoDocumento: string;
  tamanoBytes: number;
  fechaCarga: string | Date;
  usuarioCarga: string;
  urlDescarga: string;
}

export interface DocumentoRequest {
  idRegistro: number;
  tipoDocumento: string;
  archivo: File;
}
