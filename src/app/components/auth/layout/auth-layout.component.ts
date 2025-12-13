import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="auth-layout">
      <div class="auth-background"></div>
      <div class="auth-container">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .auth-layout {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    
    .auth-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('/assets/images/auth-bg.jpg') no-repeat center center;
      background-size: cover;
      opacity: 0.1;
    }
    
    .auth-container {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 500px;
      padding: 20px;
    }
  `]
})
export class AuthLayoutComponent {}
