import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgxSpinnerModule],
  template: `
    <router-outlet></router-outlet>
    <ngx-spinner
      type="ball-scale-multiple"
      [fullScreen]="true"
      color="#0d6efd"
      size="medium"
      bdColor="rgba(0,0,0,0.8)"
    >
      <p class="loading-text">Cargando...</p>
    </ngx-spinner>
  `,
  styles: [
    `
      .loading-text {
        color: white;
        font-size: 1.2rem;
        margin-top: 20px;
      }
    `,
  ],
})
export class AppComponent {
  title = 'Sistema Judicial BCI';
}
