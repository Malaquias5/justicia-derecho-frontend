import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CasosService } from '../../../../core/services/casos.service';
import { Caso } from '../../../../core/models/caso.model';

@Component({
  selector: 'app-casos-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule],
  templateUrl: './casos-list.component.html',
  styleUrls: ['./casos-list.component.scss']
})
export class CasosListComponent implements OnInit {
  casos: Caso[] = [];
  mostrarFiltros = false;
  
  filtros = {
    numeroCaso: '',
    estado: '',
    fechaDesde: null as Date | null,
    fechaHasta: null as Date | null
  };

  estados = [
    { label: 'Todos', value: '' },
    { label: 'Pendiente', value: 'Pendiente' },
    { label: 'En Proceso', value: 'En Proceso' },
    { label: 'Finalizado', value: 'Finalizado' }
  ];

  totalCasos = 0;
  casosPendientes = 0;
  casosEnProceso = 0;
  casosFinalizados = 0;

  constructor(
    private casosService: CasosService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarCasos();
  }

  cargarCasos(): void {
    this.casosService.listarCasos().subscribe({
      next: (response) => {
        if (response.success) {
          this.casos = response.data;
          this.calcularEstadisticas();
        }
      },
      error: (error) => {
        this.toastr.error('Error al cargar casos', 'Error');
      }
    });
  }

  aplicarFiltros(): void {
    this.casosService.buscarCasos(this.filtros).subscribe({
      next: (response) => {
        if (response.success) {
          this.casos = response.data;
          this.calcularEstadisticas();
          this.toastr.success('Filtros aplicados', 'Éxito');
        }
      },
      error: (error) => {
        this.toastr.error('Error al aplicar filtros', 'Error');
      }
    });
  }

  limpiarFiltros(): void {
    this.filtros = {
      numeroCaso: '',
      estado: '',
      fechaDesde: null,
      fechaHasta: null
    };
    this.cargarCasos();
  }

  calcularEstadisticas(): void {
    this.totalCasos = this.casos.length;
    this.casosPendientes = this.casos.filter(c => c.estado === 'Pendiente').length;
    this.casosEnProceso = this.casos.filter(c => c.estado === 'En Proceso').length;
    this.casosFinalizados = this.casos.filter(c => c.estado === 'Finalizado').length;
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
}
