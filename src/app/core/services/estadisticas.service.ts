import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { EstadisticasResponse } from '../models/estadistica.model';

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admin/estadisticas`;

  obtenerEstadisticas(): Observable<ApiResponse<EstadisticasResponse>> {
    return this.http.get<ApiResponse<EstadisticasResponse>>(this.apiUrl);
  }

  obtenerEstadisticasAbogados(): Observable<ApiResponse<EstadisticasResponse>> {
    return this.http.get<ApiResponse<EstadisticasResponse>>(`${this.apiUrl}/abogados`);
  }

  obtenerActividadUsuarios(ultimosDias: number = 30): Observable<ApiResponse<EstadisticasResponse>> {
    return this.http.get<ApiResponse<EstadisticasResponse>>(`${this.apiUrl}/actividad?ultimosDias=${ultimosDias}`);
  }
}
