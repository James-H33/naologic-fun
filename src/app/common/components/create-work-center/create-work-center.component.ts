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
import { ButtonModule } from '@common/directives/button/button.module';
import { InputDirective } from '@common/directives/input/input.directive';
import { FormError } from '@common/types/form-error.interface';
import { NewWorkCenter } from '@common/types/new-work-center.interface';
import { NgbCalendar, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap/datepicker';

@Component({
  selector: 'nl-create-work-center',
  templateUrl: './create-work-center.component.html',
  styleUrls: ['./create-work-center.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, InputDirective, FormsModule, FormField],
})
export class CreateWorkCenterComponent {
  open = input<boolean>();
  workCenter = input<NewWorkCenter | null>();
  workCenterError = input<FormError | null>();
  canceled = output<void>();
  created = output<{ workCenter: NewWorkCenter }>();

  model = signal<NewWorkCenter>({
    name: '',
  });

  form = form<NewWorkCenter>(this.model, (schemaPath) => {
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
      const workCenter = this.workCenter();

      if (workCenter) {
        this.model.set(workCenter);
      }
    });
  }

  create(): void {
    const formValue = this.form().value();
    // Logic to create a new work center goes here
    this.created.emit({ workCenter: formValue });
  }

  cancel(): void {
    // Logic to cancel the creation of a new work center goes here
    this.canceled.emit();
  }
}
