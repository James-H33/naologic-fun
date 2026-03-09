import { CdkMenu, CdkMenuTrigger } from '@angular/cdk/menu';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  output,
  viewChild,
} from '@angular/core';
import { take } from 'rxjs';

function convert<T>(v: unknown) {
  return v as unknown as T;
}

@Component({
  selector: 'nl-dropdown-menu',
  templateUrl: './dropdown-menu.html',
  styleUrls: ['./dropdown-menu.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CdkMenuTrigger, CdkMenu],
})
export class DropdownMenuComponent {
  hostElement = input<HTMLElement>(null!);
  menuOffsetY = input<number>(4);
  cdkMenu = viewChild(CdkMenu);
  cdkMenuTrigger = viewChild(CdkMenuTrigger);

  originGetMenu = this.cdkMenuTrigger()?.getMenu;

  opened = output<void>();
  closed = output<void>();

  constructor() {
    effect(() => {
      const menu = this.cdkMenu();

      if (menu) {
        menu.nativeElement.style.setProperty('margin-top', `${this.menuOffsetY()}px`);

        this.opened.emit();

        menu.closed.pipe(take(1)).subscribe(() => {
          this.closed.emit();
        });
      }
    });

    effect(() => {
      const trigger = this.cdkMenuTrigger();
      const host = this.hostElement();

      if (trigger && host) {
        convert<{ _elementRef: { nativeElement: HTMLElement } }>(trigger)._elementRef = {
          nativeElement: host,
        };
      }
    });
  }

  open() {
    this.cdkMenuTrigger()?.open();
  }

  onOpen(): void {
    this.opened.emit();
  }

  close(): void {
    const menu = this.cdkMenu();
    menu?.menuStack.closeAll();
  }
}
