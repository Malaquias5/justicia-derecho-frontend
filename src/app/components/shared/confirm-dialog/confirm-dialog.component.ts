import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal fade show" [class.d-block]="visible" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i [class]="icon" class="me-2" [ngClass]="iconClass"></i>
              {{ title }}
            </h5>
          </div>
          
          <div class="modal-body">
            <p>{{ message }}</p>
          </div>
          
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="onCancel()">
              Cancelar
            </button>
            <button type="button" [class]="'btn btn-' + severity" (click)="onConfirm()">
              <i [class]="confirmIcon" class="me-1"></i>
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ConfirmDialogComponent {
  @Input() visible = false;
  @Input() title = 'Confirmar acción';
  @Input() message = '¿Está seguro de realizar esta acción?';
  @Input() icon = 'pi pi-exclamation-triangle';
  @Input() iconClass = 'text-warning';
  @Input() confirmText = 'Confirmar';
  @Input() confirmIcon = 'pi pi-check';
  @Input() severity: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' = 'primary';
  
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
    this.visible = false;
  }

  onCancel(): void {
    this.cancel.emit();
    this.visible = false;
  }
}
