import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '@core/auth/auth.service';
import { SafetyNotice } from '@shared/ui/safety-notice';

interface NavItem {
  label: string;
  path: string;
}

@Component({
  selector: 'app-app-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, SafetyNotice],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex min-h-screen flex-col">
      <header class="border-b border-ink-muted/20 bg-surface">
        <div class="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <a routerLink="/app/dashboard" class="text-xl font-semibold text-primary">Anima</a>
          <nav class="flex flex-wrap items-center gap-4 text-sm" aria-label="Navegação principal">
            @for (item of items; track item.path) {
              <a
                [routerLink]="item.path"
                routerLinkActive="font-semibold underline decoration-primary underline-offset-4"
                class="text-ink hover:text-primary"
                >{{ item.label }}</a
              >
            }
            <button type="button" class="text-ink hover:text-danger" (click)="logout()">
              Sair
            </button>
          </nav>
        </div>
      </header>

      <main class="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        <router-outlet />
      </main>

      <app-safety-notice />
    </div>
  `,
})
export class AppLayout {
  private readonly auth = inject(AuthService);

  protected readonly items: NavItem[] = [
    { label: 'Início', path: '/app/dashboard' },
    { label: 'Perfil', path: '/app/perfil' },
  ];

  constructor() {
    if (!this.auth.user()) {
      this.auth.loadMe().subscribe({ error: () => this.auth.logout() });
    }
  }

  protected logout(): void {
    this.auth.logout();
  }
}