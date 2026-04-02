import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { buildChartConfig } from '../../utils/buildChartConfig';
import type { LineChartProps } from './LineChart.types';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Filler, Tooltip, Legend);

/**
 * LineChart renders a line chart using react-chartjs-2.
 * Supports smooth curves via the smooth prop.
 *
 * @example
 * ```tsx
 * <LineChart data={datasets} theme={theme} height={400} smooth />
 * ```
 */
export const LineChart: React.FC<LineChartProps> = ({
  data,
  theme,
  height = 300,
  smooth = false,
}) => {
  const config = useMemo(() => {
    const base = buildChartConfig(data, theme, 'line');

    if (smooth) {
      for (const ds of base.data.datasets) {
        ds.tension = 0.4;
      }
    }

    return base;
  }, [data, theme, smooth]);

  return (
    <div style={{ width: '100%', height }}>
      <Line
        data={config.data}
        options={config.options as React.ComponentProps<typeof Line>['options']}
      />
    </div>
  );
};

LineChart.displayName = 'LineChart';
