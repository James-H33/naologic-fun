import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, viewChild } from '@angular/core';
import { DropdownListComponent } from '@common/components/dropdown-list/dropdown-list.component';
import { DropdownMenuComponent } from '@common/components/dropdown-menu/dropdown-menu';
import { IconComponent } from '@common/components/icon/icon.component';
import { Timescale, TimescaleNames, TimescalesConfig } from '@common/types/timescales';
import { Store } from '@ngrx/store';
import { CreateWorkOrderComponent } from '@common/components/create-work-order/create-work-order.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { WorkOrderActions } from '@common/store/work-order/work-order.actions';

import { GanttActions } from './store/gantt.actions';

import {
  selectEditingWorkOrder,
  selectIsCreateWorkOrderFormOpen,
  selectIsEditWorkOrderFormOpen,
  selectNewWorkOrder,
  selectNewWorkOrderError,
} from '@common/store/work-order/work-order.selectors';
import { selectTimescaleConfig } from './store/gantt.selectors';
import { NewWorkOrder } from '@common/types/new-work-order.interface';
import { EditWorkOrderComponent } from '@common/components/edit-work-order/edit-work-order.component';
import { WorkOrderDocument } from '@common/types/work-order-document.interface';
import { ButtonModule } from '@common/directives/button/button.module';
import {
  selectIsCreateWorkCenterFormOpen,
  selectNewWorkCenter,
} from '@common/store/work-centers/work-center.selectors';
import { CreateWorkCenterComponent } from '@common/components/create-work-center/create-work-center.component';
import { WorkCenterActions } from '@common/store/work-centers/work-center.actions';
import { NewWorkCenter } from '@common/types/new-work-center.interface';
import { GanttStoreModule } from './store/gantt-store.module';

import { selectWorkOrdersGroupedByWorkCenterForGantt } from './store/gantt.selectors';

@Component({
  selector: 'nl-workorders',
  templateUrl: './work-orders-gantt.component.html',
  styleUrls: ['./work-orders-gantt.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    TimelineComponent,
    DropdownMenuComponent,
    DropdownListComponent,
    ButtonModule,
    IconComponent,
    CreateWorkOrderComponent,
    EditWorkOrderComponent,
    CreateWorkCenterComponent,
    GanttStoreModule,
  ],
})
export class WorkOrdersGanttComponent implements OnInit {
  dropdownMenu = viewChild(DropdownMenuComponent);

  store = inject(Store);

  title = 'Workorders';

  workOrdersGroupedByWorkCenter = this.store.selectSignal(
    selectWorkOrdersGroupedByWorkCenterForGantt,
  );

  isCreateWorkOrderFormOpen = this.store.selectSignal(selectIsCreateWorkOrderFormOpen);
  isEditWorkOrderFormOpen = this.store.selectSignal(selectIsEditWorkOrderFormOpen);
  isCreateWorkCenterFormOpen = this.store.selectSignal(selectIsCreateWorkCenterFormOpen);
  timescaleConfig = this.store.selectSignal(selectTimescaleConfig);
  newWorkOrder = this.store.selectSignal(selectNewWorkOrder);
  newWorkCenter = this.store.selectSignal(selectNewWorkCenter);
  editingWorkOrder = this.store.selectSignal(selectEditingWorkOrder);
  newWorkOrderError = this.store.selectSignal(selectNewWorkOrderError);
  viewId = '123';

  TimescaleNames = TimescaleNames;

  timescaleFilterOptions = [
    { id: Timescale.Day, title: TimescaleNames.day },
    { id: Timescale.Week, title: TimescaleNames.week },
    { id: Timescale.Month, title: TimescaleNames.month },
  ];

  ngOnInit() {
    this.store.dispatch(GanttActions.loadTimeScaleConfigStart({ viewId: this.viewId }));
    this.store.dispatch(GanttActions.loadWorkOrdersStart({ viewId: this.viewId }));
  }

  onTimescaleFilterOptionSelected(event: { id: string; title: string }): void {
    this.dropdownMenu()?.close();
    const config = TimescalesConfig[event.id as Timescale];

    this.store.dispatch(
      GanttActions.setTimescaleConfig({
        viewId: this.viewId,
        config,
      }),
    );
  }

  onCreateWorkOrder(event: { date: Date; workCenterId: string }) {
    this.store.dispatch(
      WorkOrderActions.openCreateWorkOrderForm({
        date: event.date,
        workCenterId: event.workCenterId,
      }),
    );
  }

  onDeleteWorkOrder(workOrderId: string) {
    this.store.dispatch(
      WorkOrderActions.deleteWorkOrder({
        workOrderId,
      }),
    );
  }

  onUpdateWorkOrder(workOrder: WorkOrderDocument) {
    this.store.dispatch(
      WorkOrderActions.editWorkOrder({
        workOrder,
      }),
    );
  }

  onOpenEditWorkOrderForm(workOrderId: string | null) {
    this.store.dispatch(
      WorkOrderActions.openEditWorkOrderForm({
        workOrderId,
      }),
    );
  }

  onEditWorkOrder(update: { workOrder: WorkOrderDocument }) {
    this.store.dispatch(
      WorkOrderActions.editWorkOrder({
        workOrder: update.workOrder,
      }),
    );
  }

  onWorkOrderCreated(event: { workOrder: NewWorkOrder }) {
    this.store.dispatch(
      WorkOrderActions.createWorkOrder({
        workOrder: event.workOrder,
      }),
    );
  }

  onCreateWorkCenter(event: { workCenter: NewWorkCenter }) {
    this.store.dispatch(WorkCenterActions.createWorkCenter({ workCenter: event.workCenter }));
  }

  onShowCreateWorkOrderForm(open: boolean) {
    const isOpen = this.isCreateWorkOrderFormOpen();

    if (isOpen === open) {
      this.store.dispatch(WorkOrderActions.setWorkOrderFormOpenState({ open: false }));
    } else {
      this.store.dispatch(WorkOrderActions.setWorkOrderFormOpenState({ open }));
    }
  }

  onShowCreateWorkCenter(open: boolean) {
    const isOpen = this.isCreateWorkCenterFormOpen();

    if (isOpen === open) {
      this.store.dispatch(WorkCenterActions.toggleCreateWorkCenterForm({ open: false }));
    } else {
      this.store.dispatch(WorkCenterActions.toggleCreateWorkCenterForm({ open }));
    }
  }
}
