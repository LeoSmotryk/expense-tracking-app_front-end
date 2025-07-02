import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-expense-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-expense-modal.html',
  styleUrl: '../add-expense-modal/add-expense-modal.css'
})
export class EditExpenseModal implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() expenseEdited = new EventEmitter<any>();
  @Input() expense: any;
  @Input() expenses: any[] = [];

  editExpense = { title: '', type: '', amount: null };
  defaultTypes: string[] = ['Food', 'Transport', 'Utilities', 'Entertainment'];
  expenseTypes: string[] = [];
  showTypeList = false;
  filteredTypes: string[] = [];
  formSubmitted = false;

  ngOnInit() {
    this.editExpense = { ...this.expense };
    this.updateExpenseTypes();
    this.filteredTypes = [...this.expenseTypes];
  }

  updateExpenseTypes() {
    const userTypes = this.expenses.map(e => e.type).filter(Boolean);
    this.expenseTypes = Array.from(new Set([...this.defaultTypes, ...userTypes]));
  }

  submit() {
    this.formSubmitted = true;
    if (
      !this.editExpense.title ||
      !this.editExpense.type ||
      !this.editExpense.amount ||
      this.editExpense.amount <= 0
    ) {
      return;
    }
    this.expenseEdited.emit(this.editExpense);
    this.close.emit();
  }

  filterTypes() {
    this.updateExpenseTypes();
    const val = this.editExpense.type?.toLowerCase() || '';
    this.filteredTypes = this.expenseTypes.filter(t => t.toLowerCase().includes(val));
    this.showTypeList = true;
  }

  selectType(type: string) {
    this.editExpense.type = type;
    this.showTypeList = false;
  }

  onTypeBlur() {
    setTimeout(() => {
      this.showTypeList = false;
    }, 200);
  }
}
