import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-report-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe],
  templateUrl: './report-modal.html',
  styleUrl: './report-modal.css'
})
export class ReportModal implements OnInit, AfterViewInit, OnChanges {
  @Input() expenses: any[] = [];
  @Input() types: string[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  periodOptions = [
    { label: 'All time', value: 'all' },
    { label: '30 days', value: '30d' },
    { label: '90 days', value: '90d' },
    { label: 'Year', value: '1y' }
  ];
  selectedPeriod = 'all';
  selectedType = 'all';

  filteredExpenses: any[] = [];
  totalAmount = 0;
  chart: any = null;

  ngOnInit() {
    this.applyFilters();
  }

  ngAfterViewInit() {
    this.renderChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['expenses']) {
      this.applyFilters();
      this.renderChart();
    }
  }

  applyFilters() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let fromDate: Date | null = null;

    if (this.selectedPeriod === '30d') {
      fromDate = new Date(today);
      fromDate.setDate(today.getDate() - 30);
    }
    if (this.selectedPeriod === '90d') {
      fromDate = new Date(today);
      fromDate.setDate(today.getDate() - 90);
    }
    if (this.selectedPeriod === '1y') {
      fromDate = new Date(today);
      fromDate.setFullYear(today.getFullYear() - 1);
    }

    this.filteredExpenses = this.expenses.filter(exp => {
      const date = new Date(exp.createdAt);
      const expDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const matchPeriod = !fromDate || expDate >= fromDate;
      const matchType = this.selectedType === 'all' || exp.type === this.selectedType;
      return matchPeriod && matchType;
    });
    this.totalAmount = this.filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    this.renderChart();
  }

  onPeriodChange(period: string) {
    this.selectedPeriod = period;
    this.applyFilters();
  }

  onTypeChange(type: string) {
    this.selectedType = type;
    this.applyFilters();
  }

  closeModal() {
    this.close.emit();
  }

  renderChart() {
    const ctx = (document.getElementById('reportChart') as HTMLCanvasElement)?.getContext('2d');
    if (!ctx) return;

    const grouped: { [date: string]: number } = {};
    this.filteredExpenses.forEach(exp => {
      const d = new Date(exp.createdAt);
      const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
      grouped[key] = (grouped[key] || 0) + exp.amount;
    });
    const labels = Object.keys(grouped).sort();
    const data = labels.map(l => grouped[l]);

    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Expenses',
          data,
          backgroundColor: 'rgba(101, 101, 101, 0.15)',
          borderColor: '#000',
          borderWidth: 2,
          pointBackgroundColor: '#000',
          pointBorderColor: '#fff',
          pointRadius: 5,
          fill: true,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            title: { display: true, text: 'Date' }
          },
          y: {
            title: { display: true, text: 'Amount' },
            beginAtZero: true
          }
        }
      }
    });
  }
}