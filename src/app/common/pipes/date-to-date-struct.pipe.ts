import { Pipe, PipeTransform } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap/datepicker';

@Pipe({
  name: 'dateToDateStruct',
  standalone: true,
})
export class DateToDateStructPipe implements PipeTransform {
  transform(value: Date | null): NgbDateStruct | null {
    if (!value) {
      return null;
    }

    return {
      year: value.getFullYear(),
      month: value.getMonth() + 1,
      day: value.getDate(),
    };
  }
}
