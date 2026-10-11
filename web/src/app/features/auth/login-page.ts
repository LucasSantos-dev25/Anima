import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '@core/auth/auth.service';
import { UiButton } from '@shared/ui/ui-button';
import { UiField } from '@shared/ui/ui-field';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, RouterLink, UiButton, UiField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form
      [formGroup]="form"
      (ngSubmit)="submit()"
      class="flex flex-col gap-4 rounded-card bg-surface p-6 shadow-sm"
      novalidate
    >
      <h2 class="text-xl font-semibold">Entrar</h2>

      @if (justRegistered) {
        <p role="status" class="rounded-card bg-primary/10 p-3 text-sm">
          Conta criada! Entre com seu e-mail e senha.
        </p>
      }

      @if (errorMessage(); as message) {
        <p role="alert" class="rounded-card bg-danger/10 p-3 text-sm text-danger">{{ message }}</p>
      }

      <app-field
        label="E-mail"
        type="email"
        autocomplete="email"
        [control]="form.controls.email"
      />
      <app-field
        label="Senha"
        type="password"
        autocomplete="current-password"
        [control]="form.controls.password"
      />

      <app-button type="submit" class="block" [loading]="loading()">Entrar</app-button>

      <p class="text-center text-sm text-ink-muted">
        Ainda não tem conta?
        <a routerLink="/cadastro" class="font-medium text-primary underline">Cadastre-se</a>
      </p>
    </form>
  `,
})
export class LoginPage {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly loading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly justRegistered = this.route.snapshot.queryParamMap.has('registered');

  protected readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

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

    this.auth
      .login(this.form.getRawValue())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
          const target = returnUrl && returnUrl.startsWith('/app') ? returnUrl : '/app/dashboard';
          void this.router.navigateByUrl(target);
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage.set(
            error.status === 401
              ? 'E-mail ou senha incorretos.'
              : 'Não foi possível entrar agora. Tente novamente.',
          );
        },
      });
  }
}