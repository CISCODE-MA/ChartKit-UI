import type { ChartDataset, ChartTheme } from '../../types/chart.types';

export interface BarChartProps {
  /** Array of datasets to render */
  data: ChartDataset[];
  /** Theme configuration for colors, fonts, grid, tooltip, and legend */
  theme: ChartTheme;
  /** Chart height in pixels @default 300 */
  height?: number;
  /** Stack bars on top of each other */
  stacked?: boolean;
  /** Render horizontal bars (indexAxis 'y') */
  horizontal?: boolean;
}
