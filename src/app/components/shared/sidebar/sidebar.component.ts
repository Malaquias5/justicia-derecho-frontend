import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles: string[];
  badge?: number;
  badgeSeverity?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="sidebar-container">
      <!-- Logo reducido -->
      <div class="sidebar-header text-center py-3">
        <i class="pi pi-shield" style="font-size: 2rem; color: #4c6ef5;"></i>
      </div>

      <!-- Menú de navegación -->
      <nav class="sidebar-nav">
        <ul class="nav flex-column">
          <li *ngFor="let item of filteredMenuItems" class="nav-item">
            <a 
              [routerLink]="item.route" 
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: false }"
              class="nav-link d-flex align-items-center py-3"
              [title]="item.label">
              
              <!-- Ícono -->
              <i [class]="item.icon" class="me-3" style="font-size: 1.2rem"></i>
              
              <!-- Etiqueta (solo visible en desktop) -->
              <span class="menu-label">{{ item.label }}</span>
              
              <!-- Badge si tiene -->
              <span *ngIf="item.badge" 
                    class="badge ms-auto"
                    [ngClass]="'bg-' + (item.badgeSeverity || 'danger')">
                {{ item.badge }}
              </span>
            </a>
          </li>
        </ul>
      </nav>

      <!-- Toggle sidebar (solo en mobile) -->
      <div class="sidebar-footer mt-auto p-3 d-lg-none">
        <button pButton 
          icon="pi pi-chevron-left" 
          class="p-button-rounded p-button-text w-100"
          (click)="toggleSidebar()">
        </button>
      </div>
    </div>
  `,
  styles: [`
    .sidebar-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
    }
    
    .sidebar-header {
      border-bottom: 1px solid #e9ecef;
    }
    
    .sidebar-nav {
      flex: 1;
      padding: 1rem 0;
    }
    
    .nav-link {
      color: #6c757d;
      transition: all 0.3s;
      border-left: 3px solid transparent;
      margin: 2px 0;
    }
    
    .nav-link:hover {
      color: #4c6ef5;
      background-color: #f8f9fa;
      border-left-color: #4c6ef5;
    }
    
    .nav-link.active {
      color: #4c6ef5;
      background-color: rgba(76, 110, 245, 0.1);
      border-left-color: #4c6ef5;
      font-weight: 600;
    }
    
    .menu-label {
      transition: opacity 0.3s;
    }
    
    .badge {
      font-size: 0.7rem;
      padding: 0.25em 0.5em;
    }
    
    @media (max-width: 992px) {
      .menu-label {
        display: none;
      }
      .nav-link {
        justify-content: center;
      }
      .nav-link i {
        margin-right: 0 !important;
      }
    }
  `]
})
export class SidebarComponent implements OnInit {
  menuItems: MenuItem[] = [];
  filteredMenuItems: MenuItem[] = [];
  isCollapsed = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMenuItems();
    this.filterMenuByRole();
  }

  private loadMenuItems(): void {
    this.menuItems = [
      // Admin menu
      { label: 'Dashboard', icon: 'pi pi-home', route: '/admin/dashboard', roles: ['Admin'] },
      { label: 'Usuarios', icon: 'pi pi-users', route: '/admin/usuarios', roles: ['Admin'] },
      { label: 'Estadísticas', icon: 'pi pi-chart-bar', route: '/admin/estadisticas', roles: ['Admin'] },
      { label: 'Todos los Casos', icon: 'pi pi-folder-open', route: '/admin/casos', roles: ['Admin'] },
      
      // Abogado menu
      { label: 'Dashboard', icon: 'pi pi-home', route: '/abogado/dashboard', roles: ['Abogado', 'Admin'] },
      { label: 'Mis Casos', icon: 'pi pi-briefcase', route: '/abogado/casos', roles: ['Abogado', 'Admin'], badge: 5, badgeSeverity: 'warning' },
      { label: 'Nuevo Caso', icon: 'pi pi-plus-circle', route: '/abogado/casos/nuevo', roles: ['Abogado', 'Admin'] },
      { label: 'Documentos', icon: 'pi pi-file', route: '/abogado/documentos', roles: ['Abogado', 'Admin'] },
      { label: 'Calendario', icon: 'pi pi-calendar', route: '/abogado/calendario', roles: ['Abogado', 'Admin'], badge: 2, badgeSeverity: 'info' },
      
      // Usuario menu
      { label: 'Mis Casos', icon: 'pi pi-folder', route: '/usuario/mis-casos', roles: ['Usuario', 'Abogado', 'Admin'] },
      { label: 'Seguimiento', icon: 'pi pi-eye', route: '/usuario/seguimiento', roles: ['Usuario', 'Abogado', 'Admin'] },
      
      // Shared menu
      { label: 'Configuración', icon: 'pi pi-cog', route: '/configuracion', roles: ['Admin', 'Abogado', 'Usuario'] },
      { label: 'Ayuda', icon: 'pi pi-question-circle', route: '/ayuda', roles: ['Admin', 'Abogado', 'Usuario'] }
    ];
  }

  private filterMenuByRole(): void {
    const userRole = this.authService.getUserRole();
    if (!userRole) return;
    
    this.filteredMenuItems = this.menuItems.filter(item => 
      item.roles.includes(userRole)
    );
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    // Aquí podrías emitir un evento o usar un servicio para comunicar el estado
  }
}
