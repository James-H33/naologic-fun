import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'nl-dropdown-list',
  templateUrl: './dropdown-list.component.html',
  styleUrls: ['./dropdown-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownListComponent {
  selectedItem = input<string>('');
  items = input<{ id: string; title: string }[]>();
  hostElement = input<HTMLElement>();
  selectionChange = output<{ id: string; title: string }>();

  width = computed(() => {
    const host = this.hostElement();

    if (host) {
      return host.offsetWidth + 'px';
    }

    return '100%';
  });
}
