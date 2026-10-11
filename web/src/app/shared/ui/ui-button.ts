import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';

const BASE =
  'inline-flex w-full items-center justify-center gap-2 rounded-card px-4 py-2 font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-contrast hover:opacity-90',
  secondary: 'border border-ink-muted/30 bg-surface text-ink hover:bg-bg',
  danger: 'bg-danger text-primary-contrast hover:opacity-90',
};

/**
 * Uso: <app-button type="submit" [loading]="loading()">Entrar</app-button>
 * Para ocupar a largura toda, adicione class="block" no <app-button>.
 */
@Component({
  selector: 'app-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button [type]="type()" [disabled]="disabled() || loading()" [class]="classes()">
      @if (loading()) {
        <span
          class="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        ></span>
      }
      <ng-content />
    </button>
  `,
})
export class UiButton {
  readonly type = input<'button' | 'submit'>('button');
  readonly variant = input<ButtonVariant>('primary');
  readonly loading = input(false);
  readonly disabled = input(false);

  protected readonly classes = computed(() => `${BASE} ${VARIANTS[this.variant()]}`);
}