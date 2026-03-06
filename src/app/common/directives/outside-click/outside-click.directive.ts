import { Directive, ElementRef, HostListener, inject, output } from '@angular/core';

@Directive({
  selector: '[nlOutsideClick]',
})
export class ClickOutsideDirective {
  clickedOutside = output();

  elementRef = inject(ElementRef);

  @HostListener('document:click', ['$event'])
  public onClick(event: Event) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);

    if (!clickedInside) {
      this.clickedOutside.emit();
    }
  }
}
