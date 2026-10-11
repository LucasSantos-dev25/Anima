import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

const INPUT_BASE =
  'w-full rounded-card border bg-surface px-3 py-2 text-ink placeholder:text-ink-muted read-only:bg-bg focus-visible:outline-2 focus-visible:outline-primary';

let nextFieldId = 0;


@Component({
  selector: 'app-field',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-1">
      <label [for]="id" class="text-sm font-medium text-ink">{{ label() }}</label>
      <input
        [id]="id"
        [type]="type()"
        [formControl]="control()"
        [readOnly]="locked()"
        [attr.autocomplete]="autocomplete()"
        [attr.aria-invalid]="showError()"
        [attr.aria-describedby]="showError() ? id + '-error' : null"
        [class]="inputClasses()"
      />
      @if (showError()) {
        <p [id]="id + '-error'" role="alert" class="text-sm text-danger">{{ errorMessage() }}</p>
      }
    </div>
  `,
})
export class UiField {
  readonly label = input.required<string>();
  readonly control = input.required<FormControl<string>>();
  readonly type = input('text');
  readonly autocomplete = input<string | null>(null);
  readonly locked = input(false);

  protected readonly id = `field-${nextFieldId++}`;

  // O estado do FormControl não é um signal; este contador avisa o componente quando ele muda.
  private readonly version = signal(0);

  protected readonly showError = computed(() => {
    this.version();
    const control = this.control();
    return control.invalid && (control.touched || control.dirty);
  });

  protected readonly inputClasses = computed(
    () => `${INPUT_BASE} ${this.showError() ? 'border-danger' : 'border-ink-muted/30'}`,
  );

  protected readonly errorMessage = computed(() => {
    this.version();
    const errors = this.control().errors;
    if (!errors) return '';
    if (errors['server']) return String(errors['server']);
    if (errors['required']) return 'Campo obrigatório.';
    if (errors['email']) return 'Informe um e-mail válido.';
    if (errors['minlength']) return `Use pelo menos ${errors['minlength'].requiredLength} caracteres.`;
    if (errors['maxlength']) return `Use no máximo ${errors['maxlength'].requiredLength} caracteres.`;
    if (errors['pattern']) return 'Formato inválido.';
    if (errors['futureDate']) return 'A data não pode estar no futuro.';
    return 'Valor inválido.';
  });

  constructor() {
    effect((onCleanup) => {
      const subscription = this.control().events.subscribe(() =>
        this.version.update((v) => v + 1),
      );
      onCleanup(() => subscription.unsubscribe());
    });
  }
}