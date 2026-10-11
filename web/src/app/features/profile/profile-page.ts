import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { AuthService } from '@core/auth/auth.service';
import { UiButton } from '@shared/ui/ui-button';
import { UiField } from '@shared/ui/ui-field';
import { pastDate } from '@shared/validators/past-date';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile-page',
  imports: [ReactiveFormsModule, UiButton, UiField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto flex max-w-xl flex-col gap-4">
      <h2 class="text-2xl font-semibold">Meu perfil</h2>

      @if (loading()) {
        <p role="status" class="text-ink-muted">Carregando seus dados...</p>
      } @else if (loadError()) {
        <p role="alert" class="rounded-card bg-danger/10 p-3 text-sm text-danger">
          Não foi possível carregar seu perfil. Recarregue a página para tentar de novo.
        </p>
      } @else {
        <form
          [formGroup]="form"
          (ngSubmit)="save()"
          class="flex flex-col gap-4 rounded-card bg-surface p-6 shadow-sm"
          novalidate
        >
          @if (saved()) {
            <p role="status" class="rounded-card bg-primary/10 p-3 text-sm">Perfil atualizado.</p>
          }
          @if (saveError()) {
            <p role="alert" class="rounded-card bg-danger/10 p-3 text-sm text-danger">
              Não foi possível salvar. Tente novamente.
            </p>
          }

          <app-field label="Nome" autocomplete="name" [control]="form.controls.name" />
          <app-field
            label="E-mail (não pode ser alterado)"
            type="email"
            [locked]="true"
            [control]="form.controls.email"
          />
          <app-field
            label="Telefone (somente números, com DDD)"
            type="tel"
            autocomplete="tel"
            [control]="form.controls.phone"
          />
          <app-field
            label="Data de nascimento"
            type="date"
            autocomplete="bday"
            [control]="form.controls.birthDate"
          />

          <app-button type="submit" class="block" [loading]="saving()" [disabled]="form.pristine">
            Salvar alterações
          </app-button>
        </form>
      }
    </section>
  `,
})
export class ProfilePage {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly profile = inject(ProfileService);
  private readonly auth = inject(AuthService);

  protected readonly loading = signal(true);
  protected readonly loadError = signal(false);
  protected readonly saving = signal(false);
  protected readonly saved = signal(false);
  protected readonly saveError = signal(false);

  protected readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: [''],
    phone: ['', [Validators.pattern(/^\d{10,11}$/)]],
    birthDate: ['', [pastDate]],
  });

  constructor() {
    this.profile
      .get()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (user) =>
          this.form.reset({
            name: user.name,
            email: user.email,
            phone: user.phone ?? '',
            birthDate: user.birthDate ?? '',
          }),
        error: () => this.loadError.set(true),
      });
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.saving()) {
      return;
    }

    this.saving.set(true);
    this.saved.set(false);
    this.saveError.set(false);

    const { name, phone, birthDate } = this.form.getRawValue();

    this.profile
      .update({ name, phone: phone || null, birthDate: birthDate || null })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (user) => {
          this.auth.setUser(user);
          this.form.markAsPristine();
          this.saved.set(true);
        },
        error: () => this.saveError.set(true),
      });
  }
}