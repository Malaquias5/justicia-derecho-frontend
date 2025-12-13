import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MainLayoutComponent } from '../../shared/layout/main-layout.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MainLayoutComponent],
  template: `<app-main-layout></app-main-layout>`
})
export class AdminLayoutComponent {}
