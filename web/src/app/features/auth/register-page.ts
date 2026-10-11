import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '@core/auth/auth.service';
import { UiButton } from '@shared/ui/ui-button';
import { UiField } from '@shared/ui/ui-field';
import { passwordsMatch } from '@shared/validators/passwords-match';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, RouterLink, UiButton, UiField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form
      [formGroup]="form"
      (ngSubmit)="submit()"
      class="flex flex-col gap-4 rounded-card bg-surface p-6 shadow-sm"
      novalidate
    >
      <h2 class="text-xl font-semibold">Criar conta</h2>

      @if (errorMessage(); as message) {
        <p role="alert" class="rounded-card bg-danger/10 p-3 text-sm text-danger">{{ message }}</p>
      }

      <app-field label="Nome" autocomplete="name" [control]="form.controls.name" />
      <app-field
        label="E-mail"
        type="email"
        autocomplete="email"
        [control]="form.controls.email"
      />
      <app-field
        label="Senha (mínimo de 8 caracteres)"
        type="password"
        autocomplete="new-password"
        [control]="form.controls.password"
      />
      <app-field
        label="Confirme a senha"
        type="password"
        autocomplete="new-password"
        [control]="form.controls.confirmPassword"
      />

      @if (form.hasError('passwordsMismatch') && form.controls.confirmPassword.touched) {
        <p role="alert" class="text-sm text-danger">As senhas não coincidem.</p>
      }

      <app-button type="submit" class="block" [loading]="loading()">Criar conta</app-button>

      <p class="text-center text-sm text-ink-muted">
        Já tem conta?
        <a routerLink="/login" class="font-medium text-primary underline">Entrar</a>
      </p>
    </form>
  `,
})
export class RegisterPage {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly loading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly form = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordsMatch },
  );

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.loading()) {
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const { name, email, password } = this.form.getRawValue();

    this.auth
      .register({ name, email, password })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          void this.router.navigate(['/login'], { queryParams: { registered: 1 } });
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 409) {
            const email = this.form.controls.email;
            email.setErrors({ server: 'Este e-mail já está em uso.' });
            email.markAsTouched();
          } else {
            this.errorMessage.set('Não foi possível criar a conta agora. Tente novamente.');
          }
        },
      });
  }
}