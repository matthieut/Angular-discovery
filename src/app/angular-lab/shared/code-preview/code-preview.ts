import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-code-preview',
  standalone: true,
  templateUrl: './code-preview.html',
  styleUrl: './code-preview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodePreview {
  readonly filename = input.required<string>();
  readonly code = input.required<string>();
  readonly caption = input('Exemple');
  readonly copied = signal(false);

  async copyCode(): Promise<void> {
    if (!navigator.clipboard) return;
    await navigator.clipboard.writeText(this.code());
    this.copied.set(true);
    window.setTimeout(() => this.copied.set(false), 1800);
  }
}
