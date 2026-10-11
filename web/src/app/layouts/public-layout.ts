import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-4 py-8">
      <div class="text-center">
        <h1 class="text-3xl font-semibold text-primary">Anima</h1>
        <p class="text-ink-muted">Cuidar de você começa aqui.</p>
      </div>
      <router-outlet />
    </main>
  `,
})
export class PublicLayout {}