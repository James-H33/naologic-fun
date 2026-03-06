/* eslint-disable @angular-eslint/no-input-rename */
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  DestroyRef,
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { skip, take } from 'rxjs/operators';

@Directive({
  selector: '[nlDropdown]',
})
export class DropdownDirective {
  templateRef = input<TemplateRef<unknown> | null>(null, { alias: 'nlDropdownTemplate' });
  dropdownTriggerType = input<'click' | 'contextmenu'>('click', { alias: 'nlDropdownTriggerType' });

  opened = output<ElementRef>({ alias: 'nlDropdownOpened' });
  closed = output<ElementRef>({ alias: 'nlDropdownClosed' });

  private overlayRef: OverlayRef | null = null;

  private destroyRef = inject(DestroyRef);
  private hostElement = inject(ElementRef);
  private vcr = inject(ViewContainerRef);
  private overlay = inject(Overlay);

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    if (this.dropdownTriggerType() !== 'click') {
      return;
    }

    this.openFromEvent(event as MouseEvent);
  }

  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: Event) {
    if (this.dropdownTriggerType() !== 'contextmenu') {
      return;
    }

    this.openFromEvent(event as MouseEvent);
  }

  open(): void {
    this.showOverlay(this.templateRef()!);
  }

  close(): void {
    this.overlayRef?.detach();
    this.overlayRef = null;
    this.closed.emit(this.hostElement);
  }

  private showOverlay(templateRef: TemplateRef<unknown>) {
    const strategy = this.overlay
      .position()
      .flexibleConnectedTo(this.hostElement)
      .withPositions([
        {
          originX: 'center',
          originY: 'top',
          overlayX: 'center',
          overlayY: 'bottom',
          offsetY: -8, // Gap between element and overlay
        },
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy: strategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });

    const portal = new TemplatePortal(templateRef, this.vcr);

    this.overlayRef.attach(portal);

    this.opened.emit(this.hostElement);
    this.watchForOutsideClicks();
  }

  private openFromEvent(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const templateRef = this.templateRef();

    if (!templateRef) {
      return;
    }

    this.showOverlay(templateRef);
  }

  private watchForOutsideClicks(): void {
    if (!this.overlayRef) {
      return;
    }

    const skipCount = this.dropdownTriggerType() === 'contextmenu' ? 1 : 0;

    this.overlayRef
      ?.outsidePointerEvents()
      .pipe(skip(skipCount), take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.close();
      });
  }
}
