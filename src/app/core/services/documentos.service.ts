import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Documento, DocumentoRequest } from '../models/documento.model';

@Injectable({
  providedIn: 'root',
})
export class DocumentosService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/abogado/documentos`;

  subirDocumento(documento: DocumentoRequest | FormData): Observable<ApiResponse<Documento>> {
    // Si ya viene como FormData, usarlo directamente
    if (documento instanceof FormData) {
      return this.http.post<ApiResponse<Documento>>(this.apiUrl, documento);
    }

    // Si no, crear el FormData
    const formData = new FormData();
    formData.append('idRegistro', documento.idRegistro.toString());
    formData.append('tipoDocumento', documento.tipoDocumento);
    formData.append('archivo', documento.archivo);

    return this.http.post<ApiResponse<Documento>>(this.apiUrl, formData);
  }

  eliminarDocumento(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  obtenerDocumento(id: number): Observable<ApiResponse<Documento>> {
    return this.http.get<ApiResponse<Documento>>(`${this.apiUrl}/${id}`);
  }

  listarDocumentosPorCaso(idRegistro: number): Observable<ApiResponse<Documento[]>> {
    return this.http.get<ApiResponse<Documento[]>>(`${this.apiUrl}/registro/${idRegistro}`);
  }

  listarMisDocumentos(): Observable<ApiResponse<Documento[]>> {
    return this.http.get<ApiResponse<Documento[]>>(`${this.apiUrl}/mis-documentos`);
  }

  descargarDocumento(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/descargar`, {
      responseType: 'blob',
    });
  }

  contarDocumentosPorCaso(idRegistro: number): Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/contar/${idRegistro}`);
  }
}
