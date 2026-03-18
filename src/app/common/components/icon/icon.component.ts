import { HttpClient } from '@angular/common/http';
import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export enum Icon {
  Down = 'down',
  Plus = 'plus',
}

@Component({
  selector: 'nl-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent {
  icon = input<Icon | string | undefined>();
  svgContent = signal<SafeHtml | null>(null);

  iconUrl = computed(() => {
    if (!this.icon()) {
      return '';
    }

    return `assets/images/${this.icon()}.svg`;
  });

  iconContainer = viewChild<ElementRef>('iconContainer');

  http = inject(HttpClient);
  sanitizer = inject(DomSanitizer);

  mutationObs: MutationObserver | null = null;

  constructor() {
    effect(() => {
      const icon = this.icon();
      const url = this.iconUrl();

      if (!icon) {
        this.svgContent.set(null);
        return;
      }

      this.http.get(url, { responseType: 'text' }).subscribe((svg) => {
        const cleanedSvg = this.sanitizer.bypassSecurityTrustHtml(svg);
        this.svgContent.set(cleanedSvg);
      });
    });

    effect(() => {
      const iconContainer = this.iconContainer();

      if (iconContainer) {
        if (this.mutationObs) {
          this.mutationObs.disconnect();
        }

        const observer = new MutationObserver((changes) => {
          this.onContentChanged(changes);
        });

        observer.observe(iconContainer.nativeElement, { childList: true, subtree: true });
        this.mutationObs = observer;
      }
    });
  }

  onContentChanged(changes: MutationRecord[]): void {
    if (changes.length > 0) {
      const iconContainer = this.iconContainer();

      if (iconContainer) {
        const svgElement = iconContainer.nativeElement.querySelector('svg');

        if (svgElement) {
          svgElement.setAttribute('width', '1em');
          svgElement.setAttribute('height', '1em');
          svgElement.setAttribute('fill', 'currentColor');
        }
      }
    }
  }
}
