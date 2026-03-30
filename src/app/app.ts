import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApplicationActions } from '@common/store/application/application.actions';
import { Store } from '@ngrx/store';
import { NavComponent } from './nav/nav.component';

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
    this.store.dispatch(ApplicationActions.init());
  }
}
