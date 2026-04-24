import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserAuthService } from '@angular-monorepo-template/core';
import { take } from 'rxjs';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'ng-mf-login-entry',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './entry.html',
  styleUrl: './entry.scss',
})
export class RemoteEntry {
  private userService = inject(UserAuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  loginFailed = signal(false);

  loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(2)]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  get username() {
    return this.loginForm.controls.username;
  }

  get password() {
    return this.loginForm.controls.password;
  }

  login() {
    this.loginFailed.set(false);

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.loginForm.getRawValue();
    this.userService.checkCredentials(username, password);
    this.userService.isUserLoggedIn$.pipe(take(1)).subscribe((loggedIn) => {
      if (loggedIn) {
        this.router.navigate(['/']);
      } else {
        this.loginFailed.set(true);
      }
    });
  }
}
