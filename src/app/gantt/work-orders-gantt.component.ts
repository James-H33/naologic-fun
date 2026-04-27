import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  viewChild,
} from '@angular/core';
import { CreateWorkOrderComponent } from '@common/components/create-work-order/create-work-order.component';
import { DropdownListComponent } from '@common/components/dropdown-list/dropdown-list.component';
import { DropdownMenuComponent } from '@common/components/dropdown-menu/dropdown-menu';
import { IconComponent } from '@common/components/icon/icon.component';
import { Timescale, TimescaleNames, TimescalesConfig } from '@common/types/timescales';
import { Store } from '@ngrx/store';
import { TimelineComponent } from './components/timeline/timeline.component';

import { GanttActions } from './store/gantt.actions';

import { CreateWorkCenterComponent } from '@common/components/create-work-center/create-work-center.component';
import { EditWorkOrderComponent } from '@common/components/edit-work-order/edit-work-order.component';
import { ButtonModule } from '@common/directives/button/button.module';
import { selectWorkCentersMap } from '@common/store/work-centers/work-center.selectors';
import { NewWorkCenter } from '@common/types/new-work-center.interface';
import { NewWorkOrder } from '@common/types/new-work-order.interface';
import { WorkOrderDocument } from '@common/types/work-order-document.interface';
import { GanttStoreModule } from './store/gantt-store.module';
import {
  selectEditingWorkOrder,
  selectEditWorkOrderFormOpen,
  selectFormError,
  selectNewWorkCenter,
  selectNewWorkOrder,
  selectTimescaleConfig,
  selectWorkCenterFormOpen,
  selectWorkOrderFormOpen,
} from './store/gantt.selectors';

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

  // Form State
  isCreateWorkOrderFormOpen = this.store.selectSignal(selectWorkOrderFormOpen);
  isEditWorkOrderFormOpen = this.store.selectSignal(selectEditWorkOrderFormOpen);
  isCreateWorkCenterFormOpen = this.store.selectSignal(selectWorkCenterFormOpen);

  newWorkOrder = this.store.selectSignal(selectNewWorkOrder);
  newWorkCenter = this.store.selectSignal(selectNewWorkCenter);
  editingWorkOrder = this.store.selectSignal(selectEditingWorkOrder);

  formError = this.store.selectSignal(selectFormError);

  workCentersMap = this.store.selectSignal(selectWorkCentersMap);

  workCenterForBeingCreatedWorkOrder = computed(() => {
    const workCenterId = this.newWorkOrder()?.workCenterId;

    if (workCenterId) {
      return this.workCentersMap()[workCenterId] || null;
    }

    return null;
  });

  timescaleConfig = this.store.selectSignal(selectTimescaleConfig);
  viewId = 'v1';

  TimescaleNames = TimescaleNames;

  timescaleFilterOptions = [
    { id: Timescale.Day, title: TimescaleNames.day },
    { id: Timescale.Week, title: TimescaleNames.week },
    { id: Timescale.Month, title: TimescaleNames.month },
  ];

  ngOnInit() {
    this.store.dispatch(GanttActions.loadTimeScaleConfigStart({ viewId: this.viewId }));
    this.store.dispatch(GanttActions.loadViewDataStart({ viewId: this.viewId }));
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
      GanttActions.openWorkOrderForm({
        date: event.date,
        workCenterId: event.workCenterId,
      }),
    );
  }

  onDeleteWorkOrder(workOrderId: string) {
    this.store.dispatch(
      GanttActions.deleteWorkOrder({
        workOrderId,
      }),
    );
  }

  onUpdateWorkOrderDates(workOrder: WorkOrderDocument) {
    this.store.dispatch(
      GanttActions.updateWorkOrderDates({
        workOrder,
      }),
    );
  }

  openEditWorkOrderForm(workOrderId: string | null) {
    this.store.dispatch(
      GanttActions.openEditWorkOrderForm({
        workOrderId,
      }),
    );
  }

  onEditWorkOrder(update: { workOrder: WorkOrderDocument }) {
    this.store.dispatch(
      GanttActions.updateWorkOrder({
        workOrder: update.workOrder,
      }),
    );
  }

  onWorkOrderCreated(event: { workOrder: NewWorkOrder }) {
    this.store.dispatch(
      GanttActions.createWorkOrder({
        newWorkOrder: event.workOrder,
      }),
    );
  }

  onCreateWorkCenter(event: { workCenter: NewWorkCenter }) {
    this.store.dispatch(GanttActions.createWorkCenter({ newWorkCenter: event.workCenter }));
  }

  closeCreateWorkOrderForm() {
    this.store.dispatch(GanttActions.closeWorkOrderForm());
  }

  closeEditWorkOrderForm() {
    this.store.dispatch(GanttActions.closeEditWorkOrderForm());
  }

  closeCreateWorkCenterForm() {
    this.store.dispatch(GanttActions.closeWorkCenterForm());
  }

  openCreateWorkCenterForm() {
    this.store.dispatch(GanttActions.openWorkCenterForm());
  }
}
