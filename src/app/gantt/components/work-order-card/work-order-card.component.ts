import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'nl-work-order-card',
  templateUrl: './work-order-card.component.html',
  styleUrls: ['./work-order-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkOrderCardComponent {
  hostElement = input<HTMLElement>();
}
