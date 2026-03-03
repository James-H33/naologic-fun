/* eslint-disable @angular-eslint/no-input-rename */
import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

@Directive({
  selector: '[nlTooltip]',
})
export class TooltipDirective {
  tooltipText = input<string>('', { alias: 'nlTooltipText' });
  tooltipTemplate = input<TemplateRef<unknown> | null>(null, { alias: 'nlTooltipTemplate' });

  private el = inject(ElementRef);
  private vcr = inject(ViewContainerRef);
  private renderer = inject(Renderer2);
  private tooltipElement: HTMLElement | null = null;

  @HostListener('mouseenter') onMouseEnter() {
    if (!this.tooltipText) return;
    this.createTooltip();
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.destroyTooltip();
  }

  private createTooltip() {
    this.tooltipElement = this.renderer.createElement('span');
    this.renderer.addClass(this.tooltipElement, 'nl-tooltip');

    if (this.tooltipTemplate()) {
      const viewRef = this.vcr.createEmbeddedView(this.tooltipTemplate() as TemplateRef<unknown>);

      this.tooltipElement = this.renderer.createElement('span');
      this.renderer.addClass(this.tooltipElement, 'nl-tooltip');

      viewRef.rootNodes.forEach((node) => {
        console.log('Node:', node);
        this.renderer.appendChild(this.tooltipElement, node);
      });

      this.renderer.appendChild(this.el.nativeElement, this.tooltipElement);
    } else {
      const text = this.renderer.createText(this.tooltipText());
      this.renderer.appendChild(this.tooltipElement, text);
    }
  }

  private destroyTooltip() {
    if (this.tooltipElement) {
      this.renderer.removeChild(this.el.nativeElement, this.tooltipElement);
      this.tooltipElement = null;
    }

    if (this.tooltipTemplate()) {
      this.vcr.clear();
      this.vcr.detach();
    }
  }
}
