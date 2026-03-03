import { WorkOrderStatus } from './work-order-status.type';

export const WorkOrderStatusColors: Record<
  WorkOrderStatus,
  {
    primary: string;
    primaryBackground: string;
    backgroundSecondary: string;
    border: string;
  }
> = {
  open: {
    primary: '#00B0BF',
    primaryBackground: '#E4FDFF',
    backgroundSecondary: '#f0fdfe',
    border: '#aaf2f9',
  },
  'in-progress': {
    primary: '#3E40DB',
    primaryBackground: '#D6D8FF',
    backgroundSecondary: '#edeeff',
    border: '#aaabf6',
  },
  complete: {
    primary: '#08A268',
    primaryBackground: '#E1FFCC',
    backgroundSecondary: '#f0ffe5',
    border: '#b6f2dc',
  },
  blocked: {
    primary: '#B13600',
    primaryBackground: '#FCEEB5',
    backgroundSecondary: '#FCEEB5',
    border: '#ee723d',
  },
};
