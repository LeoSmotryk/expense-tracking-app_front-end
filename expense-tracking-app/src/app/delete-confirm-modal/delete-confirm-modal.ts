import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-delete-confirm-modal',
  standalone: true,
  templateUrl: './delete-confirm-modal.html',
  styleUrl: '../add-expense-modal/add-expense-modal.css'
})
export class DeleteConfirmModal {
  @Input() expense: any;
  @Output() close = new EventEmitter<void>();
  @Output() deleteConfirmed = new EventEmitter<void>();

  confirmDelete() {
    this.deleteConfirmed.emit();
    this.close.emit();
  }
}
