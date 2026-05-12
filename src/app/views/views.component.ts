import { Component, effect, inject, signal } from '@angular/core';
import { ViewType } from '@common/types/view-type.enum';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { ViewsActions } from '@common/store/views/views.actions';

@Component({
  selector: 'nl-views',
  templateUrl: './views.component.html',
  styleUrls: ['./views.component.scss'],
  imports: [RouterOutlet],
})
export class ViewsComponent {
  router = inject(Router);
  store = inject(Store);

  routeChanges = toSignal(
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)),
  );

  view = signal({
    name: 'Timelines',
    type: ViewType.Timelines,
  });

  constructor() {
    effect(() => {
      const routeChange = this.routeChanges() ?? { url: '' };
      const url = routeChange.url;
      const viewType = url.split('/v/')[1]?.split('/')[0] as ViewType;
      const id = url.split('/v/')[1]?.split('/')[1];

      this.store.dispatch(ViewsActions.setView({ viewId: id, viewType }));
    });
  }
}
