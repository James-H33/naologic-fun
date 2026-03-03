import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'nl-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class NavComponent {}
