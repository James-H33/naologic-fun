import { HttpClient } from '@angular/common/http';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export enum Icon {
  Down = 'down',
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

  http = inject(HttpClient);
  sanitizer = inject(DomSanitizer);

  constructor() {
    effect(() => {
      const icon = this.icon();
      const url = this.iconUrl();

      if (!icon) {
        this.svgContent.set(null);
        return;
      }

      this.http.get(url, { responseType: 'text' }).subscribe((svg) => {
        this.svgContent.set(this.sanitizer.bypassSecurityTrustHtml(svg));
      });
    });
  }
}
