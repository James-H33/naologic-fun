import { ViewType } from '../types/view-type.enum';

export function getViewLinkByType(type: ViewType, workspaceId: string): string | null {
  switch (type) {
    case ViewType.Timeline:
      return `/${workspaceId}/v/timelines`;
    case ViewType.WorkOrders:
      return `/${workspaceId}/v/orders`;
    default:
      return null;
  }
}
