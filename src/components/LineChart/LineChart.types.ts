import type { ChartDataset, ChartTheme } from '../../types/chart.types';

export interface LineChartProps {
  /** Array of datasets to render */
  data: ChartDataset[];
  /** Theme configuration for colors, fonts, grid, tooltip, and legend */
  theme: ChartTheme;
  /** Chart height in pixels @default 300 */
  height?: number;
  /** Apply curved line interpolation (tension 0.4) @default false */
  smooth?: boolean;
}
