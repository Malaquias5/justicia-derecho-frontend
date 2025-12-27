import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EstadisticasService } from '../../../core/services/estadisticas.service';
import { EstadisticasResponse } from '../../../core/models/estadistica.model';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.scss'],
})
export class EstadisticasComponent implements OnInit {
  estadisticas: EstadisticasResponse | null = null;
  periodo = '30';

  chartData: any;
  chartOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  constructor(private estadisticasService: EstadisticasService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  cargarEstadisticas(): void {
    this.estadisticasService.obtenerEstadisticas().subscribe({
      next: (response) => {
        if (response.success) {
          this.estadisticas = response.data;
          this.actualizarChart();
        }
      },
      error: (error) => {
        this.toastr.error('Error al cargar estadísticas', 'Error');
      },
    });
  }

  get maxCasosAbogado(): number {
    if (!this.estadisticas?.estadisticasAbogados?.length) {
      return 0;
    }
    return Math.max(...this.estadisticas.estadisticasAbogados.map((e) => e.totalCasos));
  }

  actualizarChart(): void {
    if (!this.estadisticas?.estadisticasAbogados) return;

    const abogados = this.estadisticas.estadisticasAbogados.map((e) => e.abogado);
    const totales = this.estadisticas.estadisticasAbogados.map((e) => e.totalCasos);

    this.chartData = {
      labels: abogados,
      datasets: [
        {
          label: 'Casos Totales',
          data: totales,
          backgroundColor: '#36A2EB',
          borderColor: '#1E88E5',
          borderWidth: 1,
        },
      ],
    };
  }
}
