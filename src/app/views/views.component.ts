import { Component, signal } from '@angular/core';
import { ViewType } from '@common/types/view-type.enum';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'nl-views',
  templateUrl: './views.component.html',
  styleUrls: ['./views.component.scss'],
  imports: [RouterOutlet],
})
export class ViewsComponent {
  view = signal({
    name: 'Timeline',
    type: ViewType.Timeline,
  });
}
