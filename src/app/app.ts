import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './nav/nav.component';
import { Store } from '@ngrx/store';
import { WorkOrderActions } from '@common/store/work-order/work-order.actions';
import { WorkCenterActions } from '@common/store/work-centers/work-center.actions';

@Component({
  selector: 'nl-root',
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  imports: [RouterOutlet, NavComponent],
})
export class App implements OnInit {
  protected readonly title = signal('naologic-workorders');
  private store = inject(Store);

  ngOnInit(): void {
    // Should probablly be done in a resolver or something, but for simplicity just dispatching here for now
    this.store.dispatch(WorkOrderActions.loadWorkOrders());
    this.store.dispatch(WorkCenterActions.loadWorkCenters());
  }
}
