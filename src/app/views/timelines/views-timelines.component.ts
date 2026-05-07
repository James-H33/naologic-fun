import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ViewsActions } from '@common/store/views/views.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'nl-views-timelines',
  templateUrl: './views-timelines.component.html',
  styleUrls: ['./views-timelines.component.scss'],
  imports: [RouterLink],
})
export class ViewsTimelinesComponent implements OnInit {
  router = inject(Router);
  store = inject(Store);

  workspaceId = 'workspace-1';

  headers = [
    { id: 'name', label: 'Name' },
    { id: 'dateRange', label: 'Date Range' },
    { id: 'createdAt', label: 'Created At' },
  ];

  timelines = signal([
    {
      id: 'timeline-1',
      name: 'Timeline 1',
      dateRange: 'Jan 1, 2024 - Jan 31, 2024',
      createdAt: 'Dec 15, 2023',
    },
  ]);

  timelinesWithLinks = computed(() => {
    const timelines = this.timelines();

    return timelines.map((timeline) => ({
      ...timeline,
      link: `/${this.workspaceId}/v/timeline/${timeline.id}`,
    }));
  });

  ngOnInit(): void {
    this.store.dispatch(ViewsActions.loadTimelines());
  }

  // goToTimeline(timelineId: string) {
  //   this.router.navigate([`/${this.workspaceId}/timeline/${timelineId}`]);
  // }
}
