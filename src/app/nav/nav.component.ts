import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { selectWorkspaceId } from '@common/store/application/application.selectors';
import { ViewType } from '@common/types/view-type.enum';
import { getViewLinkByType } from '@common/utils/get-view-link-by-type.function';
import { Store } from '@ngrx/store';

@Component({
  selector: 'nl-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
})
export class NavComponent {
  store = inject(Store);
  navItem = signal({
    name: 'Timeline',
    type: ViewType.Timeline,
  });

  viewType = ViewType;

  workspaceId = this.store.selectSignal(selectWorkspaceId);

  private navItems = signal([
    ViewType.WorkOrders,
    ViewType.WorkCenters,
    ViewType.Timeline,
    ViewType.People,
    ViewType.Sales,
  ]);

  private navNames = {
    [ViewType.Timeline]: 'Timelines',
    [ViewType.WorkOrders]: 'Orders',
    [ViewType.WorkCenters]: 'Centers',
    [ViewType.People]: 'People',
    [ViewType.Sales]: 'Sales',
  };

  navLinks = computed(() => {
    const items = this.navItems();

    return items.map((view) => ({
      name: this.navNames[view as ViewType],
      url: getViewLinkByType(view, this.workspaceId() as string),
      isActive: ViewType.Timeline === view, // TODO: Get active view from store
    }));
  });
}
