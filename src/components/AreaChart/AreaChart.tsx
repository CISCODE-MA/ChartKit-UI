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
import type { AreaChartProps } from './AreaChart.types';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Filler, Tooltip, Legend);

/**
 * AreaChart renders a filled line chart using react-chartjs-2.
 * Uses the 'area' variant from buildChartConfig for fill with 20% opacity.
 * Supports smooth curves and stacked mode.
 *
 * @example
 * ```tsx
 * <AreaChart data={datasets} theme={theme} stacked smooth />
 * ```
 */
export const AreaChart: React.FC<AreaChartProps> = ({
  data,
  theme,
  height = 300,
  smooth = false,
  stacked = false,
}) => {
  const config = useMemo(() => {
    const base = buildChartConfig(data, theme, 'area');

    if (smooth) {
      for (const ds of base.data.datasets) {
        ds.tension = 0.4;
      }
    }

    if (stacked) {
      base.options.scales.y.stacked = true;
    }

    return base;
  }, [data, theme, smooth, stacked]);

  return (
    <div style={{ width: '100%', height }}>
      <Line
        data={config.data}
        options={config.options as React.ComponentProps<typeof Line>['options']}
      />
    </div>
  );
};

AreaChart.displayName = 'AreaChart';
