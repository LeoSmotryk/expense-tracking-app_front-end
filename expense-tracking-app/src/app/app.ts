import { Component, NgZone, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthModal } from './auth-modal/auth-modal';
import { ExpensesModal } from './expenses-modal/expenses-modal';
import { HttpClient } from '@angular/common/http';
import { ReportModal } from './report-modal/report-modal';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AuthModal, ExpensesModal, ReportModal],
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected title = 'outlay-app';
  showAuthModal = false;
  showExpensesModal = false;
  showReportModal = false;
  isFullscreen = false;
  expenses: any[] = [];
  get expenseTypes() {
    return Array.from(new Set(this.expenses.map(e => e.type)));
  }

  ngOnInit(): void {
    document.addEventListener('fullscreenchange', () => {
      this.ngZone.run(() => {
        this.isFullscreen = !!document.fullscreenElement;
      });
    });

    this.http.get('/auth/profile', { withCredentials: true }).subscribe({
      next: () => {
        this.showExpensesModal = true;
      },
      error: () => {
        this.showAuthModal = false;
        this.showExpensesModal = false;
      }
    });
  }

  constructor(private ngZone: NgZone, private http: HttpClient) { }

  openAuthModal() {
    this.showAuthModal = true;
  }

  closeAuthModal() {
    this.showAuthModal = false;
  }

  openExpensesModal() {
    this.showAuthModal = false;
    this.showExpensesModal = true;
  }

  closeExpensesModal() {
    this.showExpensesModal = false;
  }
  toggleFullscreen() {
    const elem = document.documentElement;

    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if ((elem as any).webkitRequestFullscreen) {
        (elem as any).webkitRequestFullscreen();
      } else if ((elem as any).msRequestFullscreen) {
        (elem as any).msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  }

  openReportModal(expenses: any[]) {
    this.expenses = expenses;
    this.showExpensesModal = false;
    this.showReportModal = true;
  }
  closeReportModal() {
    this.showReportModal = false;
    this.showExpensesModal = true;
  }

  onLogout() {
    this.http.post('/auth/logout', {}, { withCredentials: true }).subscribe({
      next: () => {
        localStorage.clear();
        sessionStorage.clear();
        this.showReportModal = false;
        this.showExpensesModal = false;
        this.showAuthModal = false;
      },
      error: () => {
        this.showReportModal = false;
        this.showExpensesModal = false;
        this.showAuthModal = false;
      }
    });
  }
}