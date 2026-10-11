import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '@core/auth/auth.service';

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="flex flex-col gap-6">
      <header>
        <h2 class="text-2xl font-semibold">Olá, {{ firstName() }}</h2>
        <p class="text-ink-muted">Que bom ter você aqui. Como podemos cuidar de você hoje?</p>
      </header>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <a
          routerLink="/app/perfil"
          class="rounded-card bg-surface p-5 shadow-sm transition hover:shadow-md"
        >
          <h3 class="font-semibold">Meu perfil</h3>
          <p class="text-sm text-ink-muted">Veja e atualize seus dados.</p>
        </a>

        <div class="rounded-card bg-surface p-5 opacity-60 shadow-sm">
          <h3 class="font-semibold">Buscar psicólogos</h3>
          <p class="text-sm text-ink-muted">Em breve.</p>
        </div>

        <div class="rounded-card bg-surface p-5 opacity-60 shadow-sm">
          <h3 class="font-semibold">Próxima consulta</h3>
          <p class="text-sm text-ink-muted">Em breve.</p>
        </div>
      </div>
    </section>
  `,
})
export class DashboardPage {
  private readonly auth = inject(AuthService);

  protected readonly firstName = computed(() => {
    const name = this.auth.user()?.name ?? '';
    return name.split(' ')[0] || 'bem-vindo(a)';
  });
}