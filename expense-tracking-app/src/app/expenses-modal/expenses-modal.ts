import { Component, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, DatePipe, DecimalPipe, NgIf, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddExpenseModal } from '../add-expense-modal/add-expense-modal';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { EditExpenseModal } from '../edit-expense-modal/edit-expense-modal';
import { DeleteConfirmModal } from '../delete-confirm-modal/delete-confirm-modal';

@Component({
  selector: 'app-expenses-modal',
  standalone: true,
  imports: [CommonModule, NgIf, NgForOf, DatePipe, DecimalPipe, AddExpenseModal, FormsModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatIconModule, MatNativeDateModule, DeleteConfirmModal, EditExpenseModal],
  templateUrl: './expenses-modal.html',
  styleUrl: './expenses-modal.css'
})
export class ExpensesModal {
  @Output() close = new EventEmitter<void>();
  @Output() openReport = new EventEmitter<any[]>();
  @Output() logout = new EventEmitter<void>();
  expenses: any[] = [];
  filteredExpenses: any[] = [];
  showAddModal = false;
  showEditModal = false;
  showDeleteModal = false;
  showReportModal = false;
  sortColumn: string = 'createdAt';
  sortOrder: 'desc' | 'asc' = 'desc';
  selectedDate: Date = new Date();
  expenseToEdit: any = null;
  expenseToDelete: any = null;

  constructor(private http: HttpClient) {
    this.fetchExpenses();
  }

  fetchExpenses() {
    this.http.get<any[]>('/expenses', { withCredentials: true }).subscribe({
      next: data => {
        this.expenses = data;
        this.sortExpenses();
        this.filterExpenses();
      },
      error: () => {
        this.expenses = [];
        this.filteredExpenses = [];
      }
    });
  }

  openAddModal() {
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  handleExpenseAdded(expense: any) {
    this.http.post('/expenses', expense, { withCredentials: true }).subscribe({
      next: (saved: any) => {
        this.expenses.unshift(saved);
        this.sortExpenses();
        this.filterExpenses();
        this.closeAddModal();
      }
    });
  }

  ngOnInit() {
    this.sortExpenses();
    this.filterExpenses();
  }

  sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortOrder = 'desc';
    }
    this.sortExpenses();
  }

  sortExpenses() {
    this.filteredExpenses.sort((a, b) => {
      let aValue = a[this.sortColumn];
      let bValue = b[this.sortColumn];

      if (this.sortColumn === 'createdAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      if (this.sortColumn === 'amount') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const cmp = aValue.localeCompare(bValue);
        return this.sortOrder === 'asc' ? cmp : -cmp;
      }
      return this.sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });
  }

  filterExpenses() {
    const filterYear = this.selectedDate.getFullYear();
    const filterMonth = this.selectedDate.getMonth() + 1;
    const filterDay = this.selectedDate.getDate();

    this.filteredExpenses = this.expenses.filter(exp => {
      const expDateObj = new Date(exp.createdAt);
      expDateObj.setHours(0, 0, 0, 0);
      return (
        expDateObj.getFullYear() === filterYear &&
        expDateObj.getMonth() + 1 === filterMonth &&
        expDateObj.getDate() === filterDay
      );
    });
    this.sortExpenses();
  }

  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'desc' ? 'asc' : 'desc';
    this.sortExpenses();
  }

  private formatDateLocal(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  changeDate(delta: number) {
    const baseDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate());
    baseDate.setDate(baseDate.getDate() + delta);
    baseDate.setHours(0, 0, 0, 0);
    this.selectedDate = baseDate;
    this.filterExpenses();
  }

  onMaterialDateChange(event: any) {
    if (event.value) {
      const dateObj = new Date(event.value.getFullYear(), event.value.getMonth(), event.value.getDate());
      dateObj.setHours(0, 0, 0, 0);
      this.selectedDate = dateObj;
      this.filterExpenses();
    }
  }

  get filterDate(): string {
    const yyyy = this.selectedDate.getFullYear();
    const mm = String(this.selectedDate.getMonth() + 1).padStart(2, '0');
    const dd = String(this.selectedDate.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  getToday(): string {
    return this.formatDateLocal(new Date());
  }

  openEditModal(expense: any) {
    this.expenseToEdit = { ...expense };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.expenseToEdit = null;
  }

  handleExpenseEdited(edited: any) {
    this.http.put(`/expenses/${edited._id}`, edited, { withCredentials: true }).subscribe({
      next: (updated: any) => {
        const idx = this.expenses.findIndex(e => e._id === updated._id);
        if (idx > -1) this.expenses[idx] = updated;
        this.sortExpenses();
        this.filterExpenses();
        this.closeEditModal();
      }
    });
  }

  openDeleteModal(expense: any) {
    this.expenseToDelete = expense;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.expenseToDelete = null;
  }

  handleDeleteConfirmed() {
    const idToDelete = this.expenseToDelete._id;
    this.http.delete(`/expenses/${idToDelete}`, { withCredentials: true }).subscribe({
      next: () => {
        this.expenses = this.expenses.filter(e => e._id !== idToDelete);
        this.filterExpenses();
        this.closeDeleteModal();
      }
    });
  }

  get expenseTypes() {
    return Array.from(new Set(this.expenses.map(e => e.type)));
  }

  openReportModal() {
    this.openReport.emit(this.expenses);
  }
  closeReportModal() {
    this.showReportModal = false;
  }
}
