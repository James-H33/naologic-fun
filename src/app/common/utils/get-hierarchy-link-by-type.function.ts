// import { HierarchyItem } from '@common/types/hierarchy-item.model';
// import { HierarchyType } from '@common/types/hierarchy-type.enum';

// export const getHierarchyLinkByType = (item: HierarchyItem): string => {
//   switch (item.type) {
//     case HierarchyType.SPACE: {
//       const firstSpaceView = item?.views[0];

//       if (firstSpaceView) {
//         return `v/l/${firstSpaceView.id}`;
//       }

//       const firstList = item.children?.find((child) => child.type === HierarchyType.LIST);
//       const firstListView = firstList?.views[0];

//       if (firstListView) {
//         return `v/l/${firstListView.id}`;
//       }

//       return `v/${item.id}`;
//     }
//     case HierarchyType.LIST: {
//       const firstView = item.views[0];

//       if (firstView) {
//         return `v/l/${firstView.id}`;
//       }

//       return `v/${item.id}`;
//     }
//     default:
//       return '/';
//   }
// };
