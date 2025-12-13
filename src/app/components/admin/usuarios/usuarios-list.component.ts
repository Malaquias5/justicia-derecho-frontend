import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UsuariosService } from '../../../core/services/usuarios.service';
import { Usuario } from '../../../core/models/usuario.model';

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule],
  templateUrl: './usuarios-list.component.html',
  styleUrls: ['./usuarios-list.component.scss']
})
export class UsuariosListComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  searchTerm: string = '';
  displayNuevoUsuario = false;
  
  nuevoUsuario: any = {
    usuario: '',
    nombreCompleto: '',
    email: '',
    rol: 'Usuario',
    password: ''
  };

  roles = [
    { label: 'Administrador', value: 'Admin' },
    { label: 'Abogado', value: 'Abogado' },
    { label: 'Usuario', value: 'Usuario' }
  ];

  constructor(
    private usuariosService: UsuariosService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuariosService.listarUsuarios().subscribe({
      next: (response) => {
        if (response.success) {
          this.usuarios = response.data;
          this.usuariosFiltrados = response.data;
        }
      },
      error: (error) => {
        this.toastr.error('Error al cargar usuarios', 'Error');
      }
    });
  }
  
  filtrarUsuarios(): void {
    if (!this.searchTerm) {
      this.usuariosFiltrados = this.usuarios;
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.usuariosFiltrados = this.usuarios.filter(u => 
      u.usuario.toLowerCase().includes(term) ||
      u.nombreCompleto.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      u.rol.toLowerCase().includes(term)
    );
  }

  showNuevoUsuarioDialog(): void {
    this.nuevoUsuario = {
      usuario: '',
      nombreCompleto: '',
      email: '',
      rol: 'Usuario',
      password: ''
    };
    this.displayNuevoUsuario = true;
  }

  guardarUsuario(): void {
    this.usuariosService.crearUsuario(this.nuevoUsuario).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('Usuario creado exitosamente', 'Éxito');
          this.displayNuevoUsuario = false;
          this.cargarUsuarios();
        }
      },
      error: (error) => {
        this.toastr.error('Error al crear usuario', 'Error');
      }
    });
  }

  editarUsuario(usuario: Usuario): void {
    // Implementar lógica de edición
    this.toastr.info('Funcionalidad en desarrollo', 'Info');
  }

  toggleUsuarioEstado(usuario: Usuario): void {
    const accion = usuario.activo ? 'desactivar' : 'activar';
    
    if (confirm(`¿Está seguro de ${accion} al usuario ${usuario.nombreCompleto}?`)) {
      if (usuario.activo) {
        this.usuariosService.desactivarUsuario(usuario.idUsuario).subscribe({
          next: () => {
            this.toastr.success('Usuario desactivado', 'Éxito');
            this.cargarUsuarios();
          },
          error: () => this.toastr.error('Error al desactivar usuario', 'Error')
        });
      } else {
        this.usuariosService.activarUsuario(usuario.idUsuario).subscribe({
          next: () => {
            this.toastr.success('Usuario activado', 'Éxito');
            this.cargarUsuarios();
          },
          error: () => this.toastr.error('Error al activar usuario', 'Error')
        });
      }
    }
  }

  onFilter(event: any): void {
    // El filtro global de PrimeNG se maneja automáticamente
  }

  getRolSeverity(rol: string): string {
    switch(rol) {
      case 'Admin': return 'danger';
      case 'Abogado': return 'info';
      case 'Usuario': return 'success';
      default: return 'secondary';
    }
  }
  
  getUsuarioRolClass(rol: string): string {
    switch(rol) {
      case 'Admin': return 'bg-danger';
      case 'Abogado': return 'bg-info';
      case 'Usuario': return 'bg-success';
      default: return 'bg-secondary';
    }
  }
}
