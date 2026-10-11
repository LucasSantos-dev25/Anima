import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-safety-notice',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer
      class="border-t border-ink-muted/20 bg-surface px-4 py-4 text-center text-sm text-ink-muted"
    >
      O Anima não substitui atendimento profissional e não faz diagnósticos. Se você estiver em
      sofrimento, o <strong>CVV</strong> atende 24h pelo telefone
      <a href="tel:188" class="font-medium text-primary underline">188</a> (ligação gratuita). Em
      caso de emergência, ligue 192 (SAMU).
    </footer>
  `,
})
export class SafetyNotice {}