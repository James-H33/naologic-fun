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
import { DateToDateStructPipe } from '@common/pipes/date-to-date-struct.pipe';
import { StatusComponent } from '@common/components/status/status.component';
import { FormError } from '@common/types/form-error.interface';

@Component({
  selector: 'nl-create-work-order',
  templateUrl: './create-work-order.component.html',
  styleUrls: ['./create-work-order.component.scss'],
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
export class CreateWorkOrderComponent {
  open = input<boolean>();
  workOrder = input<NewWorkOrder | null>();
  workOrderError = input<FormError | null>();
  canceled = output<void>();
  created = output<{ workOrder: NewWorkOrder }>();

  model = signal<NewWorkOrder>({
    title: '',
    startDate: null,
    endDate: null,
    workCenterId: '',
    status: 'open',
  });

  form = form<NewWorkOrder>(this.model, (schemaPath) => {
    required(schemaPath.title);
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
        this.model.set(workOrder);
      }
    });
  }

  onStartDateChanged(date: NgbDateStruct) {
    this.model.update((current) => ({
      ...current,
      startDate: new Date(date.year, date.month - 1, date.day),
    }));

    this.startDatePicker()?.close();
  }

  onEndDateChanged(date: NgbDateStruct) {
    this.model.update((current) => ({
      ...current,
      endDate: new Date(date.year, date.month - 1, date.day),
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

  create(): void {
    const formValue = this.form().value();
    // Logic to create a new work order goes here
    this.created.emit({ workOrder: formValue });
  }

  cancel(): void {
    // Logic to cancel the creation of a new work order goes here
    this.canceled.emit();
  }
}
