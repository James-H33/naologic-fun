import { AfterViewInit, Directive, effect, ElementRef, inject, input, signal } from '@angular/core';

@Directive({
  selector: '[nlAutoFocus]',
})
export class AutoFocusDirective implements AfterViewInit {
  delay = input(100, { alias: 'nlAutoFocusDelay' });
  enabled = input(true, { alias: 'nlAutoFocusEnabled' });
  viewInitialized = signal(false);

  private el = inject(ElementRef);

  constructor() {
    effect(() => {
      if (this.enabled() && this.viewInitialized()) {
        setTimeout(() => {
          this.el.nativeElement.focus();
        }, this.delay());
      }
    });
  }

  ngAfterViewInit() {
    this.viewInitialized.set(true);
  }
}
