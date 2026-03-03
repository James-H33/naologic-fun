import { CdkMenu, CdkMenuTrigger } from '@angular/cdk/menu';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';
import { take } from 'rxjs';

@Component({
  selector: 'nl-dropdown-menu',
  templateUrl: './dropdown-menu.html',
  styleUrls: ['./dropdown-menu.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CdkMenuTrigger, CdkMenu],
})
export class DropdownMenuComponent {
  menuOffsetY = input<number>(4);
  cdkMenu = viewChild(CdkMenu);
  cdkMenuTrigger = viewChild(CdkMenuTrigger);

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
  }

  onOpen(): void {
    this.opened.emit();
  }

  close(): void {
    const menu = this.cdkMenu();
    menu?.menuStack.closeAll();
  }
}
