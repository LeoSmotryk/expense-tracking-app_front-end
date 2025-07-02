import { Component, Output, EventEmitter } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule],
  templateUrl: './auth-modal.html',
  styleUrl: './auth-modal.css'
})
export class AuthModal {
  @Output() close = new EventEmitter<void>();
  @Output() authSuccess = new EventEmitter<void>();

  isLogin = true;
  showLoginPassword = false;
  showSignupPassword = false;
  showSignupRepeatPassword = false;
  loginSubmitted = false;
  signupSubmitted = false;

  loginForm: FormGroup;
  signupForm: FormGroup;
  errorMsg = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required]
    });
  }

  onLogin() {
    this.loginSubmitted = true;
    this.errorMsg = '';
    if (this.loginForm.invalid) return;
    const { email, password } = this.loginForm.value;
    this.http.post('/auth/login', { username: email, password }, { withCredentials: true }).subscribe({
      next: () => {
        this.authSuccess.emit();
        this.close.emit();
      },
      error: err => this.errorMsg = err.error?.message || 'Login failed'
    });
  }

  onSignup() {
    this.signupSubmitted = true;
    this.errorMsg = '';
    if (this.signupForm.invalid) return;
    const { email, password, repeatPassword } = this.signupForm.value;
    if (password !== repeatPassword) {
      this.errorMsg = 'Passwords do not match';
      return;
    }
    this.http.post('/auth/signup', { username: email, password }, { withCredentials: true }).subscribe({
      next: () => {
        this.http.post('/auth/login', { username: email, password }, { withCredentials: true }).subscribe({
          next: () => {
            this.authSuccess.emit();
            this.close.emit();
          },
          error: err => this.errorMsg = err.error?.message || 'Login failed'
        });
      },
      error: err => this.errorMsg = err.error?.error || 'Registration failed'
    });
  }
}
