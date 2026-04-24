import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserAuthService } from '@angular-monorepo-template/core';
import { take } from 'rxjs';

@Component({
  imports: [FormsModule],
  selector: 'ng-mf-login-entry',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="login-page">
      <div class="login-card">
        <h1 class="login-title">Sign in</h1>
        <p class="login-subtitle">Enter your credentials to continue</p>
        <form
          class="login-form"
          (ngSubmit)="login()"
          (keydown.enter)="$event.preventDefault(); login()"
        >
          <div class="form-group">
            <label for="username" class="form-label">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              class="form-input"
              [(ngModel)]="username"
              autocomplete="username"
              placeholder="Username"
            />
          </div>
          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              class="form-input"
              [(ngModel)]="password"
              autocomplete="current-password"
              placeholder="Password"
            />
          </div>
          <button class="btn btn--primary login-btn" type="submit">
            Sign in
          </button>
        </form>
      </div>
    </div>
  `,
  styles: `
    .login-page {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: calc(100vh - 60px);
      background-color: var(--color-bg);
    }

    .login-card {
      background-color: var(--color-white);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      padding: 2.5rem 2rem;
      width: 100%;
      max-width: 400px;
      margin: 1rem;
    }

    .login-title {
      font-size: 1.875rem;
      font-weight: 600;
      color: var(--color-primary);
      margin: 0 0 0.25rem;
    }

    .login-subtitle {
      color: var(--color-text-muted);
      font-size: 0.875rem;
      margin: 0 0 2rem;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .form-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-text);
    }

    .form-input {
      width: 100%;
      padding: 0.625rem 0.875rem;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      font-size: 0.9375rem;
      font-family: var(--font-sans);
      color: var(--color-text);
      background-color: var(--color-white);
      outline: none;
      transition-property: border-color, box-shadow;
      transition-duration: 150ms;
      transition-timing-function: var(--transition-timing);
      box-sizing: border-box;
    }

    .form-input::placeholder {
      color: var(--color-text-muted);
      opacity: 0.7;
    }

    .form-input:focus {
      border-color: var(--color-accent);
      box-shadow: 0 0 0 3px hsla(162, 47%, 50%, 0.15);
    }

    .login-btn {
      width: 100%;
      padding: 0.75rem;
      font-size: 1rem;
      border: none;
      margin-top: 0.25rem;
    }
  `,
})
export class RemoteEntry {
  private userService = inject(UserAuthService);
  private router = inject(Router);

  username = '';
  password = '';

  login() {
    this.userService.checkCredentials(this.username, this.password);
    this.userService.isUserLoggedIn$.pipe(take(1)).subscribe((loggedIn) => {
      if (loggedIn) this.router.navigate(['/']);
    });
  }
}
