import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Caso, CasoRequest, BusquedaCasos } from '../models/caso.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class CasosService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/registros`;

  crearCaso(caso: CasoRequest): Observable<ApiResponse<Caso>> {
    return this.http.post<ApiResponse<Caso>>(this.apiUrl, caso);
  }

  actualizarCaso(id: number, caso: CasoRequest): Observable<ApiResponse<Caso>> {
    return this.http.put<ApiResponse<Caso>>(`${this.apiUrl}/${id}`, caso);
  }

  eliminarCaso(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  obtenerCaso(id: number): Observable<ApiResponse<Caso>> {
    return this.http.get<ApiResponse<Caso>>(`${this.apiUrl}/${id}`);
  }

  obtenerCasoPorNumero(numeroCaso: string): Observable<ApiResponse<Caso>> {
    return this.http.get<ApiResponse<Caso>>(`${this.apiUrl}/caso/${numeroCaso}`);
  }

  listarCasos(): Observable<ApiResponse<Caso[]>> {
    return this.http.get<ApiResponse<Caso[]>>(this.apiUrl);
  }

  buscarCasos(filtros: BusquedaCasos): Observable<ApiResponse<Caso[]>> {
    let params = new HttpParams();
    
    if (filtros.numeroCaso) params = params.set('numeroCaso', filtros.numeroCaso);
    if (filtros.abogado) params = params.set('abogado', filtros.abogado);
    if (filtros.estado) params = params.set('estado', filtros.estado);
    if (filtros.dependencia) params = params.set('dependencia', filtros.dependencia);
    if (filtros.fechaDesde) params = params.set('fechaDesde', filtros.fechaDesde.toISOString().split('T')[0]);
    if (filtros.fechaHasta) params = params.set('fechaHasta', filtros.fechaHasta.toISOString().split('T')[0]);

    return this.http.get<ApiResponse<Caso[]>>(`${this.apiUrl}/buscar`, { params });
  }

  listarCasosActivos(): Observable<ApiResponse<Caso[]>> {
    return this.http.get<ApiResponse<Caso[]>>(`${this.apiUrl}/activos`);
  }

  listarCasosPorAbogado(abogado: string): Observable<ApiResponse<Caso[]>> {
    return this.http.get<ApiResponse<Caso[]>>(`${this.apiUrl}/abogado/${abogado}`);
  }

  listarCasosProximosVencer(diasLimite: number = 7): Observable<ApiResponse<Caso[]>> {
    return this.http.get<ApiResponse<Caso[]>>(`${this.apiUrl}/vencimiento/proximos?diasLimite=${diasLimite}`);
  }
}
