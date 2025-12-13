import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CasosService } from '../../../../core/services/casos.service';
import { SeguimientosService } from '../../../../core/services/seguimientos.service';
import { DocumentosService } from '../../../../core/services/documentos.service';

@Component({
  selector: 'app-caso-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink],
  templateUrl: './caso-detail.component.html',
  styleUrls: ['./caso-detail.component.scss']
})
export class CasoDetailComponent implements OnInit {
  id!: number;
  caso: any = null;
  seguimientos: any[] = [];
  documentos: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private casosService: CasosService,
    private seguimientosService: SeguimientosService,
    private documentosService: DocumentosService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarCaso();
    this.cargarSeguimientos();
    this.cargarDocumentos();
  }

  cargarCaso(): void {
    this.casosService.obtenerCaso(this.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.caso = response.data;
        } else {
          this.router.navigate(['/abogado/casos']);
        }
      },
      error: () => {
        this.toastr.error('Error al cargar caso', 'Error');
        this.router.navigate(['/abogado/casos']);
      }
    });
  }

  cargarSeguimientos(): void {
    this.seguimientosService.listarSeguimientosPorCaso(this.id).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.seguimientos = response.data;
        }
      }
    });
  }

  cargarDocumentos(): void {
    this.documentosService.listarDocumentosPorCaso(this.id).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.documentos = response.data;
        }
      }
    });
  }

  getEstadoSeverity(estado: string): 'success' | 'info' | 'danger' {
    switch(estado) {
      case 'Pendiente': return 'warn' as any;
      case 'En Proceso': return 'info';
      case 'Finalizado': return 'success';
      default: return 'info';
    }
  }

  getUrgenciaSeverity(urgencia: string): 'danger' | 'warn' | 'info' | 'success' {
    switch (urgencia) {
      case 'Vencido': return 'danger';
      case 'Urgente': return 'warn';
      case 'Próximo': return 'warn';
      case 'Normal': return 'success';
      default: return 'info';
    }
  }
  
  getEstadoClass(estado: string): string {
    switch(estado) {
      case 'Pendiente': return 'bg-warning text-dark';
      case 'En Proceso': return 'bg-info';
      case 'Finalizado': return 'bg-success';
      default: return 'bg-secondary';
    }
  }
  
  getUrgenciaClass(urgencia: string): string {
    switch (urgencia) {
      case 'Vencido': return 'bg-danger';
      case 'Urgente': return 'bg-warning text-dark';
      case 'Próximo': return 'bg-warning text-dark';
      case 'Normal': return 'bg-success';
      default: return 'bg-secondary';
    }
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
