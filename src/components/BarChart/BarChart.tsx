import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { buildChartConfig } from '../../utils/buildChartConfig';
import type { BarChartProps } from './BarChart.types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

/**
 * BarChart renders a bar chart using react-chartjs-2.
 * Supports stacked and horizontal variants via typed props only.
 *
 * @example
 * ```tsx
 * <BarChart data={datasets} theme={theme} height={400} stacked />
 * ```
 */
export const BarChart: React.FC<BarChartProps> = ({
  data,
  theme,
  height = 300,
  stacked = false,
  horizontal = false,
}) => {
  const config = useMemo(() => {
    const base = buildChartConfig(data, theme, 'bar');

    if (stacked) {
      base.options.scales.x.stacked = true;
      base.options.scales.y.stacked = true;
    }

    if (horizontal) {
      base.options.indexAxis = 'y';
    }

    return base;
  }, [data, theme, stacked, horizontal]);

  return (
    <div style={{ width: '100%', height }}>
      <Bar
        data={config.data}
        options={config.options as React.ComponentProps<typeof Bar>['options']}
      />
    </div>
  );
};

BarChart.displayName = 'BarChart';
