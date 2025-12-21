import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from '../../shared/layout/main-layout.component';

@Component({
  selector: 'app-abogado-layout',
  standalone: true,
  imports: [CommonModule, MainLayoutComponent],
  template: `<app-main-layout></app-main-layout>`,
})
export class AbogadoLayoutComponent {}
