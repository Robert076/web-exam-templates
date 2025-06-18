import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="login-container">
      <h2>Login</h2>
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            type="text"
            id="username"
            formControlName="username"
            class="form-control"
            placeholder="Enter your username"
          />
          <div
            *ngIf="
              loginForm.get('username')?.invalid &&
              (loginForm.get('username')?.dirty ||
                loginForm.get('username')?.touched)
            "
            class="error-message"
          >
            Username is required
          </div>
        </div>

        <div class="form-group">
          <button
            type="submit"
            [disabled]="loginForm.invalid || loading"
            class="btn btn-primary"
          >
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </div>

        <div *ngIf="error" class="error-message">
          {{ error }}
        </div>

        <div class="info-message">
          Enter your username to access the application
        </div>
      </form>

      <div *ngIf="loginSuccess" class="success-section">
        <div class="success-message">
          Login successful! Welcome, {{ currentUsername }}!
        </div>
        <div class="action-buttons">
          <button 
            (click)="viewProducts()" 
            class="btn btn-success products-btn"
          >
            View All Products
          </button>
          <button 
            (click)="viewBooks()" 
            class="btn btn-secondary books-btn"
          >
            View Books
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .login-container {
        max-width: 400px;
        margin: 2rem auto;
        padding: 2rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      h2 {
        text-align: center;
        margin-bottom: 1.5rem;
      }

      .form-group {
        margin-bottom: 1rem;
      }

      label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
      }

      .form-control {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
      }

      button {
        width: 100%;
        padding: 0.75rem;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
        margin-bottom: 0.5rem;
      }

      button:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
      }

      .error-message {
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 0.25rem;
      }

      .info-message {
        margin-top: 1rem;
        text-align: center;
        color: #6c757d;
        font-size: 0.875rem;
      }

      .success-section {
        margin-top: 2rem;
        padding: 1rem;
        background-color: #d4edda;
        border: 1px solid #c3e6cb;
        border-radius: 4px;
      }

      .success-message {
        text-align: center;
        color: #155724;
        font-weight: bold;
        margin-bottom: 1rem;
        font-size: 1.1rem;
      }

      .action-buttons {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .products-btn {
        background-color: #28a745;
        font-weight: bold;
      }

      .products-btn:hover {
        background-color: #218838;
      }

      .books-btn {
        background-color: #6c757d;
      }

      .books-btn:hover {
        background-color: #5a6268;
      }
    `,
  ],
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error = '';
  loginSuccess = false;
  currentUsername = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.loading = false;
        this.loginSuccess = true;
        this.currentUsername = response.username || this.loginForm.value.username;
      },
      error: (error) => {
        this.error =
          error.error?.message ||
          'Login failed. Please check your username.';
        this.loading = false;
      },
    });
  }

  viewProducts() {
    this.router.navigate(['/products']);
  }

  viewBooks() {
    this.router.navigate(['/books']);
  }
}
