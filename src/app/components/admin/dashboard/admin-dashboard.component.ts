import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { EstadisticasService } from '../../../core/services/estadisticas.service';
import { CasosService } from '../../../core/services/casos.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  stats: any[] = [];
  casosUrgentes: any[] = [];
  estadosChart: any;
  recentActivity: any[] = [];
  
  chartOptions = {
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  constructor(
    private estadisticasService: EstadisticasService,
    private casosService: CasosService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadCasosUrgentes();
    this.loadEstadosChart();
    this.loadRecentActivity();
  }

  private loadStats(): void {
    this.stats = [
      { 
        title: 'Total Casos', 
        value: '156', 
        subtitle: '+12% este mes',
        description: 'Casos activos en el sistema',
        colorClass: 'text-primary'
      },
      { 
        title: 'Usuarios', 
        value: '48', 
        subtitle: '+3 nuevos',
        description: 'Usuarios registrados',
        colorClass: 'text-success'
      },
      { 
        title: 'Vencimientos', 
        value: '7', 
        subtitle: 'Esta semana',
        description: 'Casos por vencer',
        colorClass: 'text-warning'
      },
      { 
        title: 'Eficiencia', 
        value: '94%', 
        subtitle: '+5% vs mes anterior',
        description: 'Casos resueltos',
        colorClass: 'text-info'
      }
    ];
  }

  private loadCasosUrgentes(): void {
    this.casosService.listarCasosProximosVencer(7).subscribe({
      next: (response) => {
        if (response.success) {
          this.casosUrgentes = response.data;
        }
      },
      error: (error) => {
        this.toastr.error('Error al cargar casos urgentes', 'Error');
      }
    });
  }

  private loadEstadosChart(): void {
    this.estadosChart = {
      labels: ['Pendiente', 'En Proceso', 'Finalizado'],
      datasets: [
        {
          data: [45, 78, 33],
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#4BC0C0'
          ],
          hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#4BC0C0'
          ]
        }
      ]
    };
  }

  private loadRecentActivity(): void {
    this.recentActivity = [
      {
        icon: 'pi pi-user-plus',
        iconClass: 'text-success',
        title: 'Nuevo usuario registrado',
        description: 'Carlos Rodríguez se registró como abogado',
        time: 'Hace 2 horas'
      },
      {
        icon: 'pi pi-file-edit',
        iconClass: 'text-primary',
        title: 'Caso actualizado',
        description: 'Caso CASO-2024-0015 fue actualizado',
        time: 'Hace 4 horas'
      },
      {
        icon: 'pi pi-check-circle',
        iconClass: 'text-info',
        title: 'Caso finalizado',
        description: 'Caso CASO-2024-0008 fue cerrado',
        time: 'Hace 1 día'
      },
      {
        icon: 'pi pi-exclamation-triangle',
        iconClass: 'text-warning',
        title: 'Caso próximo a vencer',
        description: 'Caso CASO-2024-0012 vence en 2 días',
        time: 'Hace 1 día'
      }
    ];
  }

  getEstadoSeverity(estado: string): 'success' | 'info' | 'danger' {
    switch(estado) {
      case 'Pendiente': return 'warn' as any;
      case 'En Proceso': return 'info';
      case 'Finalizado': return 'success';
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
}
