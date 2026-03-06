import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { DropdownListItem } from '@common/types/dropdown-list-item.interface';

@Component({
  selector: 'nl-dropdown-list',
  templateUrl: './dropdown-list.component.html',
  styleUrls: ['./dropdown-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
})
export class DropdownListComponent {
  selectedItem = input<string>('');
  items = input<DropdownListItem[]>();
  hostElement = input<HTMLElement>();
  selectionChange = output<DropdownListItem>();

  width = computed(() => {
    const host = this.hostElement();

    if (host) {
      return host.offsetWidth + 'px';
    }

    return '100%';
  });
}
