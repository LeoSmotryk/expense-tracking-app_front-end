import { Component, Output, EventEmitter, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-expense-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-expense-modal.html',
  styleUrl: './add-expense-modal.css'
})
export class AddExpenseModal implements OnInit, OnChanges {
  @Output() close = new EventEmitter<void>();
  @Output() expenseAdded = new EventEmitter<any>();
  @Input() expenses: any[] = [];

  newExpense = { title: '', type: '', amount: null };

  defaultTypes: string[] = ['Food', 'Transport', 'Utilities', 'Entertainment'];
  expenseTypes: string[] = [];
  showTypeList = false;
  filteredTypes: string[] = [];

  formSubmitted = false;

  ngOnInit() {
    this.updateExpenseTypes();
    this.filteredTypes = [...this.expenseTypes];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['expenses']) {
      this.updateExpenseTypes();
      this.filteredTypes = [...this.expenseTypes];
    }
  }

  updateExpenseTypes() {
    const userTypes = this.expenses.map(e => e.type).filter(Boolean);
    this.expenseTypes = Array.from(new Set([...this.defaultTypes, ...userTypes]));
  }

  submit() {
    this.formSubmitted = true;
    if (
      !this.newExpense.title ||
      !this.newExpense.type ||
      !this.newExpense.amount ||
      this.newExpense.amount <= 0
    ) {
      return;
    }
    this.expenseAdded.emit(this.newExpense);
    this.newExpense = { title: '', type: '', amount: null };
    this.formSubmitted = false;
    this.close.emit();
  }

  filterTypes() {
    this.updateExpenseTypes();
    const val = this.newExpense.type?.toLowerCase() || '';
    this.filteredTypes = this.expenseTypes.filter(t => t.toLowerCase().includes(val));
    this.showTypeList = true;
  }

  selectType(type: string) {
    this.newExpense.type = type;
    this.showTypeList = false;
  }

  onTypeBlur() {
    setTimeout(() => {
      this.showTypeList = false;
    }, 200);
  }
}
