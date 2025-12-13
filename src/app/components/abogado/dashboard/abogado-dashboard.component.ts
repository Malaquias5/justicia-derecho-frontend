import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CasosService } from '../../../core/services/casos.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-abogado-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './abogado-dashboard.component.html',
  styleUrls: ['./abogado-dashboard.component.scss']
})
export class AbogadoDashboardComponent implements OnInit {
  user: any = null;
  casos: any[] = [];
  casosUrgentes: any[] = [];
  
  totalCasos = 0;
  casosPendientes = 0;
  casosEnProceso = 0;
  casosFinalizados = 0;
  pendientesUrgentes = 0;
  
  chartData: any;
  chartOptions = {
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  constructor(
    private authService: AuthService,
    private casosService: CasosService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.cargarCasos();
  }

  cargarCasos(): void {
    this.casosService.listarCasos().subscribe({
      next: (response) => {
        if (response.success) {
          this.casos = response.data;
          this.calcularEstadisticas();
          this.filtrarCasosUrgentes();
          this.actualizarChart();
        }
      },
      error: (error) => {
        this.toastr.error('Error al cargar casos', 'Error');
      }
    });
  }

  calcularEstadisticas(): void {
    this.totalCasos = this.casos.length;
    this.casosPendientes = this.casos.filter(c => c.estado === 'Pendiente').length;
    this.casosEnProceso = this.casos.filter(c => c.estado === 'En Proceso').length;
    this.casosFinalizados = this.casos.filter(c => c.estado === 'Finalizado').length;
    this.pendientesUrgentes = this.casos.filter(c => 
      c.estado === 'Pendiente' && c.diasRestantes <= 7
    ).length;
  }

  filtrarCasosUrgentes(): void {
    this.casosUrgentes = this.casos.filter(c => 
      c.diasRestantes <= 14 && c.estado !== 'Finalizado'
    ).sort((a, b) => a.diasRestantes - b.diasRestantes);
  }

  actualizarChart(): void {
    this.chartData = {
      labels: ['Pendientes', 'En Proceso', 'Finalizados'],
      datasets: [
        {
          data: [this.casosPendientes, this.casosEnProceso, this.casosFinalizados],
          backgroundColor: ['#FF6384', '#36A2EB', '#4BC0C0'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#4BC0C0']
        }
      ]
    };
  }

  getDiasSeverity(dias: number): 'danger' | 'warn' | 'info' {
    if (dias <= 3) return 'danger';
    if (dias <= 7) return 'warn';
    return 'info';
  }
}
