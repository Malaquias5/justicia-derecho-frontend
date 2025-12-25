import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Seguimiento, SeguimientoRequest } from '../models/seguimiento.model';

@Injectable({
  providedIn: 'root',
})
export class SeguimientosService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/abogado/seguimientos`;

  crearSeguimiento(seguimiento: any): Observable<ApiResponse<Seguimiento>> {
    return this.http.post<ApiResponse<Seguimiento>>(this.apiUrl, seguimiento);
  }

  actualizarSeguimiento(
    id: number,
    seguimiento: SeguimientoRequest
  ): Observable<ApiResponse<Seguimiento>> {
    return this.http.put<ApiResponse<Seguimiento>>(`${this.apiUrl}/${id}`, seguimiento);
  }

  eliminarSeguimiento(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  obtenerSeguimiento(id: number): Observable<ApiResponse<Seguimiento>> {
    return this.http.get<ApiResponse<Seguimiento>>(`${this.apiUrl}/${id}`);
  }

  listarSeguimientosPorCaso(idRegistro: number): Observable<ApiResponse<Seguimiento[]>> {
    return this.http.get<ApiResponse<Seguimiento[]>>(`${this.apiUrl}/registro/${idRegistro}`);
  }

  listarMisSeguimientos(): Observable<ApiResponse<Seguimiento[]>> {
    return this.http.get<ApiResponse<Seguimiento[]>>(`${this.apiUrl}/mis-seguimientos`);
  }

  obtenerUltimoNumeroSeguimiento(idRegistro: number): Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/ultimo-numero/${idRegistro}`);
  }
}
