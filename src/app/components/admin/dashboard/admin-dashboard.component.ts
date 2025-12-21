import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EstadisticasService } from '../../../core/services/estadisticas.service';
import { CasosService } from '../../../core/services/casos.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  stats: any[] = [];
  casosUrgentes: any[] = [];
  estadosChart: any;
  recentActivity: any[] = [];
  private chart: any;

  chartOptions = {
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
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

  ngAfterViewInit(): void {
    this.initChart();
  }

  private initChart(): void {
    if (typeof window !== 'undefined' && this.chartCanvas) {
      import('chart.js/auto')
        .then((Chart) => {
          const ctx = this.chartCanvas.nativeElement.getContext('2d');
          if (ctx) {
            this.chart = new Chart.default(ctx, {
              type: 'doughnut',
              data: {
                labels: ['Pendiente', 'En Proceso', 'Finalizado'],
                datasets: [
                  {
                    label: 'Casos',
                    data: [45, 78, 33],
                    backgroundColor: [
                      'rgba(255, 193, 7, 0.8)',
                      'rgba(13, 202, 240, 0.8)',
                      'rgba(25, 135, 84, 0.8)',
                    ],
                    borderColor: [
                      'rgba(255, 193, 7, 1)',
                      'rgba(13, 202, 240, 1)',
                      'rgba(25, 135, 84, 1)',
                    ],
                    borderWidth: 2,
                  },
                ],
              },
              options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      padding: 15,
                      font: {
                        size: 12,
                      },
                    },
                  },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const total = context.dataset.data.reduce(
                          (a: number, b: number) => a + b,
                          0
                        );
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: ${value} casos (${percentage}%)`;
                      },
                    },
                  },
                },
              },
            });
          }
        })
        .catch((err) => {
          console.error('Error loading Chart.js:', err);
          this.toastr.warning('No se pudo cargar el gráfico', 'Advertencia');
        });
    }
  }

  private loadStats(): void {
    this.stats = [
      {
        title: 'Total Casos',
        value: '156',
        subtitle: '+12% este mes',
        description: 'Casos activos en el sistema',
        colorClass: 'text-primary',
      },
      {
        title: 'Usuarios',
        value: '48',
        subtitle: '+3 nuevos',
        description: 'Usuarios registrados',
        colorClass: 'text-success',
      },
      {
        title: 'Vencimientos',
        value: '7',
        subtitle: 'Esta semana',
        description: 'Casos por vencer',
        colorClass: 'text-warning',
      },
      {
        title: 'Eficiencia',
        value: '94%',
        subtitle: '+5% vs mes anterior',
        description: 'Casos resueltos',
        colorClass: 'text-info',
      },
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
      },
    });
  }

  private loadEstadosChart(): void {
    this.estadosChart = {
      labels: ['Pendiente', 'En Proceso', 'Finalizado'],
      datasets: [
        {
          data: [45, 78, 33],
          backgroundColor: ['#FF6384', '#36A2EB', '#4BC0C0'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#4BC0C0'],
        },
      ],
    };
  }

  private loadRecentActivity(): void {
    this.recentActivity = [
      {
        icon: 'bi bi-person-plus-fill',
        iconClass: 'text-white',
        bgClass: 'bg-success',
        title: 'Nuevo usuario registrado',
        description: 'Carlos Rodríguez se registró como abogado',
        time: 'Hace 2 horas',
      },
      {
        icon: 'bi bi-pencil-square',
        iconClass: 'text-white',
        bgClass: 'bg-primary',
        title: 'Caso actualizado',
        description: 'Caso CASO-2024-0015 fue actualizado',
        time: 'Hace 4 horas',
      },
      {
        icon: 'bi bi-check-circle-fill',
        iconClass: 'text-white',
        bgClass: 'bg-info',
        title: 'Caso finalizado',
        description: 'Caso CASO-2024-0008 fue cerrado exitosamente',
        time: 'Hace 1 día',
      },
      {
        icon: 'bi bi-exclamation-triangle-fill',
        iconClass: 'text-white',
        bgClass: 'bg-warning',
        title: 'Caso próximo a vencer',
        description: 'Caso CASO-2024-0012 vence en 2 días',
        time: 'Hace 1 día',
      },
      {
        icon: 'bi bi-file-earmark-arrow-up',
        iconClass: 'text-white',
        bgClass: 'bg-secondary',
        title: 'Documento subido',
        description: 'Nuevo documento en CASO-2024-0020',
        time: 'Hace 2 días',
      },
    ];
  }

  getEstadoSeverity(estado: string): 'success' | 'info' | 'danger' {
    switch (estado) {
      case 'Pendiente':
        return 'warn' as any;
      case 'En Proceso':
        return 'info';
      case 'Finalizado':
        return 'success';
      default:
        return 'info';
    }
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'Pendiente':
        return 'bg-warning text-dark';
      case 'En Proceso':
        return 'bg-info';
      case 'Finalizado':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  }

  exportarDatos(): void {
    this.toastr.info('Generando exportación...', 'Exportar Datos');
    // TODO: Implementar lógica de exportación real
    setTimeout(() => {
      this.toastr.success('Funcionalidad en desarrollo', 'Exportar');
    }, 1000);
  }
}
