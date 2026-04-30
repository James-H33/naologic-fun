import { Component, inject, OnInit } from '@angular/core';
import { ApplicationActions } from '@common/store/application/application.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'nl-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent implements OnInit {
  store = inject(Store);

  ngOnInit(): void {
    this.store.dispatch(ApplicationActions.logout());
  }
}
