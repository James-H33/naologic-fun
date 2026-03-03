import { Component, contentChild, input, output, viewChild } from '@angular/core';
import { WorkOrderStatus } from '@common/types/work-order-status.type';
import { DropdownListComponent } from '../dropdown-list/dropdown-list.component';
import { DropdownMenuComponent } from '../dropdown-menu/dropdown-menu';

@Component({
  selector: 'nl-status-picker',
  templateUrl: './status-picker.component.html',
  styleUrls: ['./status-picker.component.scss'],
  imports: [DropdownListComponent, DropdownMenuComponent],
})
export class StatusPickerComponent {
  status = input<WorkOrderStatus>('open');
  hostElement = input<HTMLElement>();

  statusChanged = output<WorkOrderStatus>();

  dropdownMenu = viewChild(DropdownMenuComponent);
  trigger = contentChild<HTMLElement>('trigger');

  statusOptions: { id: WorkOrderStatus; title: string }[] = [
    { id: 'open', title: 'Open' },
    { id: 'in-progress', title: 'In Progress' },
    { id: 'complete', title: 'Complete' },
    { id: 'blocked', title: 'Blocked' },
  ] as const;

  onStatusChange(selected: { id: string; title: string }) {
    this.dropdownMenu()?.close();
    this.statusChanged.emit(selected.id as WorkOrderStatus);
  }
}
