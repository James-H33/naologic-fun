import {
  ChangeDetectionStrategy,
  Component,
  effect,
  HostBinding,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, FormField, required } from '@angular/forms/signals';
import { StatusPickerComponent } from '@common/components/status-picker/status-picker.component';
import { ButtonModule } from '@common/directives/button/button.module';
import { InputDirective } from '@common/directives/input/input.directive';
import { NewWorkOrder } from '@common/types/new-work-order.interface';
import {
  NgbCalendar,
  NgbDateStruct,
  NgbInputDatepicker,
} from '@ng-bootstrap/ng-bootstrap/datepicker';
import { DateToDateStructPipe } from '../../../common/pipes/date-to-date-struct.pipe';
import { StatusComponent } from '@common/components/status/status.component';
import { FormError } from '@common/types/form-error.interface';
import { WorkOrderDocument } from '@common/types/work-order-document.interface';
import { getDateAsISOString } from '@common/utils/get-date-as-iso-string.function';

@Component({
  selector: 'nl-edit-work-order',
  templateUrl: './edit-work-order.component.html',
  styleUrls: ['./edit-work-order.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    InputDirective,
    NgbInputDatepicker,
    FormsModule,
    FormField,
    DateToDateStructPipe,
    StatusPickerComponent,
    StatusComponent,
  ],
})
export class EditWorkOrderComponent {
  open = input<boolean>();
  workOrder = input<WorkOrderDocument | null>();
  workOrderError = input<FormError | null>();
  canceled = output<void>();
  updated = output<{ workOrder: WorkOrderDocument }>();

  model = signal<WorkOrderDocument['data']>({
    name: '',
    startDate: null,
    endDate: null,
    workCenterId: '',
    status: 'open',
  });

  form = form<WorkOrderDocument['data']>(this.model, (schemaPath) => {
    required(schemaPath.name);
  });

  startDatePicker = viewChild<NgbInputDatepicker>('startDatePicker');
  endDatePicker = viewChild<NgbInputDatepicker>('endDatePicker');

  today = inject(NgbCalendar).getToday();

  date!: { year: number; month: number };

  displayMonths = 2;
  navigation = 'select';
  showWeekNumbers = false;
  outsideDays = 'visible';

  currentPicker!: 'start' | 'end';

  @HostBinding('class.open') isOpen = false;

  constructor() {
    effect(() => {
      const open = this.open();

      if (open) {
        this.isOpen = true;
      } else {
        this.isOpen = false;
      }
    });

    effect(() => {
      const workOrder = this.workOrder();

      if (workOrder) {
        this.model.set(workOrder.data);
      }
    });
  }

  onStartDateChanged(date: NgbDateStruct) {
    this.model.update((current) => ({
      ...current,
      startDate: this.convertDateStringToDateString(date),
    }));

    this.startDatePicker()?.close();
  }

  onEndDateChanged(date: NgbDateStruct) {
    this.model.update((current) => ({
      ...current,
      endDate: this.convertDateStringToDateString(date),
    }));

    this.endDatePicker()?.close();
  }

  onStatusChanged(status: string) {
    this.model.update((current) => ({
      ...current,
      status: status as NewWorkOrder['status'],
    }));
  }

  openDatePicker(picker: NgbInputDatepicker) {
    picker.toggle();
  }

  update(): void {
    const formValue = this.form().value();
    const workOrder = this.workOrder();

    if (!workOrder) {
      return;
    }

    const updatedWorkOrder: WorkOrderDocument = {
      ...workOrder,
      data: {
        ...workOrder.data,
        ...formValue,
      },
    };

    this.updated.emit({ workOrder: updatedWorkOrder });
  }

  convertDateStringToDateString(dateStruct: NgbDateStruct | null): string | null {
    return dateStruct
      ? getDateAsISOString(new Date(dateStruct.year, dateStruct.month - 1, dateStruct.day))
      : null;
  }

  cancel(): void {
    this.canceled.emit();
  }
}
