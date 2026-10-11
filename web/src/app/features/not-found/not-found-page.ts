import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 px-4">
      <h1 class="text-3xl font-semibold text-primary">Página não encontrada</h1>
      <p class="text-center text-ink-muted">O endereço que você tentou abrir não existe.</p>
      <a routerLink="/app/dashboard" class="font-medium text-primary underline">Voltar ao início</a>
    </main>
  `,
})
export class NotFoundPage {}