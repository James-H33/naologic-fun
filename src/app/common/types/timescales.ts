export enum Timescale {
  Hour = 'hour',
  Day = 'day',
  Week = 'week',
  Month = 'month',
}

export const TimescaleNames = {
  [Timescale.Hour]: 'Hour',
  [Timescale.Day]: 'Day',
  [Timescale.Week]: 'Week',
  [Timescale.Month]: 'Month',
};

export interface TimescaleConfig {
  scale: Timescale;
  colWidth: number;
  scales: {
    name: string;
  }[];
}

export const TimescalesConfig: Record<Timescale, TimescaleConfig> = {
  [Timescale.Hour]: {
    scale: Timescale.Hour,
    colWidth: 20,
    scales: [
      {
        name: 'Hour',
      },
    ],
  },
  [Timescale.Day]: {
    scale: Timescale.Day,
    colWidth: 120,
    scales: [
      {
        name: 'Day',
      },
    ],
  },
  [Timescale.Week]: {
    scale: Timescale.Week,
    colWidth: 120,
    scales: [
      {
        name: 'Week',
      },
    ],
  },
  [Timescale.Month]: {
    scale: Timescale.Month,
    colWidth: 113,
    scales: [
      {
        name: 'Month',
      },
    ],
  },
};
