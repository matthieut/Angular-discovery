import { Directive, effect, ElementRef, inject, input, Renderer2 } from '@angular/core';

@Directive({ selector: '[appHighlight]', standalone: true })
export class HighlightDirective {
  readonly appHighlight = input(false);
  private readonly element = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);

  constructor() {
    effect(() =>
      this.renderer.setStyle(
        this.element.nativeElement,
        'border-color',
        this.appHighlight() ? 'var(--lab-secondary)' : null,
      ),
    );
  }
}
