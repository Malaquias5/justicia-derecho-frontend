import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, SidebarComponent],
  template: `
    <div class="layout-wrapper">
      <!-- Navbar -->
      <app-navbar></app-navbar>
      
      <div class="layout-container d-flex">
        <!-- Sidebar -->
        <app-sidebar class="sidebar"></app-sidebar>
        
        <!-- Main Content -->
        <main class="main-content flex-grow-1">
          <div class="container-fluid py-4">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .layout-wrapper {
      min-height: 100vh;
      background-color: #f8f9fa;
    }
    
    .sidebar {
      width: 250px;
      min-height: calc(100vh - 70px);
      background: white;
      box-shadow: 2px 0 10px rgba(0,0,0,0.1);
      position: sticky;
      top: 70px;
    }
    
    .main-content {
      padding-left: 20px;
      padding-right: 20px;
    }
    
    @media (max-width: 992px) {
      .sidebar {
        width: 70px;
      }
      .main-content {
        padding-left: 10px;
        padding-right: 10px;
      }
    }
  `]
})
export class MainLayoutComponent {}
