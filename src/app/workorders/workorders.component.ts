import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, viewChild } from '@angular/core';
import { DropdownListComponent } from '@common/components/dropdown-list/dropdown-list.component';
import { DropdownMenuComponent } from '@common/components/dropdown-menu/dropdown-menu';
import { IconComponent } from '@common/components/icon/icon.component';
import { Timescale, TimescaleNames, TimescalesConfig } from '@common/types/timescales';
import { Store } from '@ngrx/store';
import { CreateWorkOrderComponent } from './components/create-work-order/create-work-order.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import {
  createWorkOrder,
  loadTimeScaleConfigStart,
  loadWorkOrdersStart,
  openCreateWorkOrderForm,
  setTimescaleConfig,
  setWorkOrderFormOpenState,
} from './store/work-order/work-order.actions';
import {
  selectIsWorkOrderFormOpen,
  selectNewWorkOrder,
  selectNewWorkOrderError,
  selectTimescaleConfig,
  selectWorkOrdersGroupedByWorkCenter,
} from './store/work-order/work-order.selectors';
import { NewWorkOrder } from '@common/types/new-work-order.interface';

@Component({
  selector: 'nl-workorders',
  templateUrl: './workorders.component.html',
  styleUrls: ['./workorders.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    TimelineComponent,
    DropdownMenuComponent,
    DropdownListComponent,
    IconComponent,
    CreateWorkOrderComponent,
  ],
})
export class WorkordersComponent implements OnInit {
  dropdownMenu = viewChild(DropdownMenuComponent);

  store = inject(Store);

  title = 'Workorders';

  workOrdersGroupedByWorkCenter = this.store.selectSignal(selectWorkOrdersGroupedByWorkCenter);

  isWorkOrderFormOpen = this.store.selectSignal(selectIsWorkOrderFormOpen);

  timescaleConfig = this.store.selectSignal(selectTimescaleConfig);

  newWorkOrder = this.store.selectSignal(selectNewWorkOrder);

  newWorkOrderError = this.store.selectSignal(selectNewWorkOrderError);

  viewId = '123';

  TimescaleNames = TimescaleNames;

  timescaleFilterOptions = [
    { id: Timescale.Day, title: TimescaleNames.day },
    { id: Timescale.Week, title: TimescaleNames.week },
    { id: Timescale.Month, title: TimescaleNames.month },
  ];

  ngOnInit() {
    this.store.dispatch(loadTimeScaleConfigStart({ viewId: this.viewId }));
    this.store.dispatch(loadWorkOrdersStart({ viewId: this.viewId }));
  }

  onTimescaleFilterOptionSelected(event: { id: string; title: string }): void {
    this.dropdownMenu()?.close();
    const config = TimescalesConfig[event.id as Timescale];

    this.store.dispatch(
      setTimescaleConfig({
        viewId: this.viewId,
        config,
      }),
    );
  }

  onCreateWorkOrder(event: { date: Date; workCenterId: string }) {
    this.store.dispatch(
      openCreateWorkOrderForm({ date: event.date, workCenterId: event.workCenterId }),
    );
  }

  onWorkOrderCreated(event: { workOrder: NewWorkOrder }) {
    this.store.dispatch(
      createWorkOrder({
        workOrder: event.workOrder,
      }),
    );
  }

  onShowCreateWorkOrderForm(open: boolean) {
    const isOpen = this.isWorkOrderFormOpen();

    if (isOpen === open) {
      this.store.dispatch(setWorkOrderFormOpenState({ open: false }));
    } else {
      this.store.dispatch(setWorkOrderFormOpenState({ open }));
    }
  }
}
