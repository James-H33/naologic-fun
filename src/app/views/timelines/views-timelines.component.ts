import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { selectWorkspaceId } from '@common/store/application/application.selectors';
import { ViewsActions } from '@common/store/views/views.actions';
import { selectTimelines } from '@common/store/views/views.selectors';
import { Store } from '@ngrx/store';

@Component({
  selector: 'nl-views-timelines',
  templateUrl: './views-timelines.component.html',
  styleUrls: ['./views-timelines.component.scss'],
  imports: [RouterLink, DatePipe],
})
export class ViewsTimelinesComponent implements OnInit {
  router = inject(Router);
  store = inject(Store);

  timelines = this.store.selectSignal(selectTimelines);
  workspaceId = this.store.selectSignal(selectWorkspaceId);

  headers = [
    { id: 'name', label: 'Name' },
    { id: 'dateRange', label: 'Date Range' },
    { id: 'createdAt', label: 'Created At' },
  ];

  timelinesWithLinks = computed(() => {
    const timelines = this.timelines();
    const workspaceId = this.workspaceId();

    return timelines.map((timeline) => ({
      ...timeline,
      link: `/${workspaceId}/v/timeline/${timeline.id}`,
    }));
  });

  ngOnInit(): void {
    this.store.dispatch(ViewsActions.loadTimelines());
  }
}
